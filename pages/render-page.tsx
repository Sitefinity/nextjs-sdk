import { RenderPageClient } from './render-page-client';
import { pageLayout } from './utils';
import { RenderWidgetService } from '../services/render-widget-service';
import { RenderLazyWidgetsClient } from './render-lazy-widgets.client';
import { RenderPageScripts } from './render-page-scripts';
import { Dictionary } from '../typings/dictionary';
import { ServiceMetadata } from '../rest-sdk/service-metadata';
import { headers } from 'next/headers';
import { ErrorCodeException } from '../rest-sdk/errors/error-code.exception';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { LayoutResponse } from '../rest-sdk/dto/layout-service.response';
import { PageItem } from '../rest-sdk/dto/page-item';
import { PageScriptLocation } from '../rest-sdk/dto/scripts';
import { PageFrontEndUtilLoader } from './page-frontend-util-loader';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { getPageNumber } from '../widgets/pager/pager-view-model';
import { ContentListEntityBase } from '../widgets/content-lists-common/content-lists-base.entity';
import { ContentListsCommonRestService } from '../widgets/content-lists-common/content-lists-rest.setvice';
import { initServerSideRestSdk } from '../rest-sdk/init';
import { setHostServerContext } from '../services/server-context';
import { TemplateRegistry } from '../editor/default-template-registry';
import { initRegistry, WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { JSX } from 'react';
import { UrlParams } from './page-params';
import { env } from 'process';
import { WidgetMetadata, WidgetViewsRegistration } from '../editor/widget-framework/widget-metadata';
import { widgetRegistry } from '@widgetregistry';
import { isReactClientComponent, SF_WEBSERVICE_API_KEY } from '../widgets/common/utils';
import { RequestContext } from '../editor/request-context';

export async function RenderPage({ params, searchParams, relatedFields, templates }: { params: UrlParams | Promise<UrlParams>, searchParams: Dictionary | Promise<Dictionary>, relatedFields?: string[], templates?: TemplateRegistry }) {
    const host = (await headers()).get('host') || '';
    const pageParams = params instanceof Promise ? await params : params;
    const queryParams = (searchParams instanceof Promise ? await searchParams : searchParams) ?? {};
    setHostServerContext(host);

    if (!RenderWidgetService.widgetRegistry) {
        RenderWidgetService.widgetRegistry = initRegistry(widgetRegistry);
    }

    let layoutResponse: LayoutResponse | null = null;

    if (pageParams && pageParams.slug && pageParams.slug.length > 0) {
        if (pageParams.slug.some(x => x === '_next') || pageParams.slug[pageParams.slug.length - 1].indexOf('.') !== -1) {
            notFound();
        }
    }

    if (queryParams && queryParams['sf-auth']) {
        queryParams['sf-auth'] = encodeURIComponent(queryParams['sf-auth']);
    }

    const { span, ctx } = Tracer.startSpan(`RenderPage ${pageParams?.slug.join('/')}`, true);
    try {
        layoutResponse = await pageLayout({ params: pageParams, searchParams: queryParams, relatedFields, traceContext: ctx });
    } catch (error) {
        if (error instanceof ErrorCodeException && (error.code === 'NotFound' || error.code === 'Forbidden' || error.code === 'Unauthorized')) {
            if (env.NODE_ENV !== 'production') {
                console.log(error);
            }

            notFound();
        }
    }

    if (!layoutResponse) {
        throw layoutResponse;
    }

    // nasty hack
    if (layoutResponse.isRedirect) {
        const redirectResponse = layoutResponse.redirect!;
        if (redirectResponse.Permenant) {
            return permanentRedirect(redirectResponse.Location);
        } else {
            return redirect(redirectResponse.Location);
        }

    }

    if (!layoutResponse.layout) {
        return notFound();
    }

    const isEdit = queryParams['sfaction'] === 'edit';
    const isPreview = queryParams['sfaction'] === 'preview';
    const isLive = !(isEdit || isPreview);

    const layout = layoutResponse.layout;
    await initServerSideRestSdk({
        metadataHash: layout.MetadataHash,
        queryParams: {
            sf_culture: layout.Culture,
            sf_site: isEdit || layout.Site.IsSubFolder ? layout.SiteId : ''
        }
    });

    const requestContext : RequestContext = {
        layout: layout,
        searchParams: queryParams,
        detailItem: layout.DetailItem,
        culture: layout.Culture,
        isEdit,
        isPreview,
        isLive,
        url: pageParams?.slug.join('/'),
        pageNode: layout.Fields as PageItem,
        webserviceApiKey: process.env[SF_WEBSERVICE_API_KEY]
    };

    // get all list widgets
    const allWidgets = flattenWidgets(layout.ComponentContext.Components || []);
    allWidgets.filter(x => x.Name === 'SitefinityContentList' || x.Name === 'SitefinityDocumentList').forEach(x => {
        // try to resolve pagers
        const entity: ContentListEntityBase = x.Properties as ContentListEntityBase;
        getPageNumber(entity.PagerMode, requestContext, entity.PagerQueryTemplate, entity.PagerTemplate);

        // try to resolve classifications
        ContentListsCommonRestService.getClassificationSegment(requestContext);
    });

    // if not resolved urls => 404
    if (layout.UrlParameters && layout.UrlParameters.length > 0 && !layout.DetailItem) {
        notFound();
    }

    const liveUrl = '/' + pageParams?.slug.join('/') + '?' + new URLSearchParams(queryParams).toString();

    let pageTemplate;
    if (layout.TemplateName && templates && templates[layout.TemplateName]) {
        let template = templates[layout.TemplateName];
        if (template && template.templateFunction) {
            const sortedWidgets: {[key: string]: (JSX.Element | null) [] } = {};
            layout.ComponentContext.Components.forEach(widget => {
                const placeholder = widget.PlaceHolder;
                if (!sortedWidgets[placeholder]) {
                    sortedWidgets[placeholder] = [];
                }

                sortedWidgets[placeholder].push(RenderWidgetService.createComponent(widget, requestContext, ctx));
            });

            if (isEdit) {
                layout.ComponentContext.OrphanedControls.forEach(widget => {
                    const placeholder = 'Body';
                    if (!sortedWidgets[placeholder]) {
                        sortedWidgets[placeholder] = [];
                    }

                    widget.Orphaned = true;
                    sortedWidgets[placeholder].push(RenderWidgetService.createComponent(widget, requestContext, ctx));
                });
            }

            pageTemplate = template.templateFunction({ widgets: sortedWidgets, requestContext: requestContext });
        }
    }

    if (!pageTemplate) {
        const widgets = layout.ComponentContext.Components;
        if (isEdit) {
            layout.ComponentContext.OrphanedControls.forEach(widget => widget.Orphaned = true);
            widgets.push(...layout.ComponentContext.OrphanedControls);
        }

        pageTemplate = widgets.map((child) => {
            return RenderWidgetService.createComponent(child, requestContext, ctx);
        });
    }

    // The registry for the frontend should only contain widgets that have client-side views.
    const registryForFrontend: WidgetRegistry = {
        widgets: Object.fromEntries(Object.entries(RenderWidgetService.widgetRegistry.widgets).map(([key, registration]) => {
            if (!registration.ssr) {
                return [key, registration];
            }

            const hasClientView = hasClientSideView(registration.views);

            if (hasClientView) {
                return [key, {
                    views: Object.fromEntries(Object.entries(registration.views || {}).map(([viewName, view]) => {
                        if (viewHasClientComponent(view)) {
                            return [viewName, view];
                        }

                        return [viewName, null];
                    }))
                }];
            }

            return [key, null];
        }).filter(([key, value]) => value != null)) // filter out widgets without client-side views
    };

    // The registry for edit mode should contain all widgets, but only those with client-side views will be rendered.
    const registryForEdit: WidgetRegistry = {
        widgets: Object.fromEntries(Object.entries(RenderWidgetService.widgetRegistry.widgets).map(([key, registration]) => {
            if (!registration.ssr) {
                return [key, registration];
            }

            const hasClientView = hasClientSideView(registration.views);

            if (hasClientView) {
                return [key, {
                    designerMetadata: registration.designerMetadata,
                    editorMetadata: registration.editorMetadata,
                    ssr: registration.ssr,
                    views: Object.fromEntries(Object.entries(registration.views || {}).map(([viewName, view]) => {
                        if (viewHasClientComponent(view)) {
                            return [viewName, view];
                        }

                        return [viewName, null];
                    }))
                }];
            }

            const reg: WidgetMetadata = {
                designerMetadata: registration.designerMetadata,
                editorMetadata: registration.editorMetadata,
                ssr: registration.ssr,
                componentType: null
            };
            return [key, reg];
        }))
    };

    const isTesting = process.env.NODE_ENV === 'test';

    return (
      <>
        <PageFrontEndUtilLoader metadata={ServiceMetadata.serviceMetadataCache}
          taxonomies={ServiceMetadata.taxonomies}
          additionalQueryParams={{ sf_culture: layout.Culture, sf_site: isEdit || layout.Site.IsSubFolder ? layout.SiteId : ''}}
          registry={registryForFrontend}/>
        {!isTesting && <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.Head} /> }
        {!isTesting && <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.BodyTop} /> }
        {isEdit && <RenderPageClient layout={layout} metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} context={requestContext} registry={registryForEdit} />}
        {!isEdit && requestContext.layout?.ComponentContext.HasLazyComponents && <RenderLazyWidgetsClient metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} url={liveUrl} registry={registryForFrontend} />}
        {pageTemplate}
        {!isTesting && <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.BodyBottom} /> }
        {Tracer.endSpan(span)}
      </>
    );
}

function flattenWidgets(widgets: WidgetModel[]) {
    return widgets.reduce((acc: WidgetModel[], widget: WidgetModel): WidgetModel[] =>  {
                if (Array.isArray(widget?.Children) && widget.Children.length) {
                    return acc.concat(flattenWidgets(widget.Children));
                }

                return acc.concat([widget]);
            }, []);
}

function hasClientSideView(views: WidgetViewsRegistration | undefined): boolean {
    return Object.values(views || {}).some(viewHasClientComponent);
}

function viewHasClientComponent(view: any): boolean {
    return isReactClientComponent(view) || isReactClientComponent(view?.ViewFunction);
}
