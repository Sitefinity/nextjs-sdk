import { RenderPageClient } from './render-page-client';
import { pageLayout } from './utils';
import { AppState } from './app-state';
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
import { TemplateRegistry } from '..';
import { WidgetModel } from '../editor/widget-framework/widget-model';

export async function RenderPage({ params, searchParams, relatedFields, templates }: { params: { slug: string[] }, searchParams: Dictionary, relatedFields?: string[], templates?: TemplateRegistry }) {
    const host = headers().get('host') || '';
    setHostServerContext(host);

    let layoutResponse: LayoutResponse | null = null;

    if (params && params.slug && params.slug.length > 0) {
        if (params.slug.some(x => x === '_next') || params.slug[params.slug.length - 1].indexOf('.') !== -1) {
            notFound();
        }
    }

    if (searchParams && searchParams['sf-auth']) {
        searchParams['sf-auth'] = encodeURIComponent(searchParams['sf-auth']);
    }

    const { span, ctx } = Tracer.startSpan(`RenderPage ${params.slug.join('/')}`, true);
    try {
        layoutResponse = await pageLayout({ params, searchParams, relatedFields, traceContext: ctx });
    } catch (error) {
        if (error instanceof ErrorCodeException && error.code === 'NotFound') {
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

    const isEdit = searchParams['sfaction'] === 'edit';
    const isPreview = searchParams['sfaction'] === 'preview';
    const isLive = !(isEdit || isPreview);

    const layout = layoutResponse.layout;
    await initServerSideRestSdk({
        metadataHash: layout.MetadataHash,
        queryParams: {
            sf_culture: layout.Culture,
            sf_site: isEdit || layout.Site.IsSubFolder ? layout.SiteId : ''
        }
    });

    const appState : AppState = {
        requestContext: {
            layout: layout,
            searchParams: searchParams,
            detailItem: layout.DetailItem,
            culture: layout.Culture,
            isEdit,
            isPreview,
            isLive,
            url: params.slug.join('/'),
            pageNode: layout.Fields as PageItem
        },
        widgets: layout.ComponentContext.Components
    };

    // get all list widgets
    const allWidgets = flattenWidgets(layout.ComponentContext.Components || []);
    allWidgets.filter(x => x.Name === 'SitefinityContentList' || x.Name === 'SitefinityDocumentList').forEach(x => {
        // try to resolve pagers
        const entity: ContentListEntityBase = x.Properties as ContentListEntityBase;
        getPageNumber(entity.PagerMode, appState.requestContext, entity.PagerQueryTemplate, entity.PagerTemplate);

        // try to resolve classifications
        ContentListsCommonRestService.getClassificationSegment(appState.requestContext);
    });

    // if not resolved urls => 404
    if (layout.UrlParameters && layout.UrlParameters.length > 0 && !layout.DetailItem) {
        notFound();
    }

    const liveUrl = '/' + params.slug.join('/') + '?' + new URLSearchParams(searchParams).toString();

    let pageTemplate;
    if (layout.TemplateName && templates && templates[layout.TemplateName]) {
        let template = templates[layout.TemplateName];
        if (template && template.templateFunction) {
            const sortedWidgets: {[key: string]: (JSX.Element | null) [] } = {};
            appState.widgets.forEach(widget => {
                const placeholder = widget.PlaceHolder;
                if (!sortedWidgets[placeholder]) {
                    sortedWidgets[placeholder] = [];
                }

                sortedWidgets[placeholder].push(RenderWidgetService.createComponent(widget, appState.requestContext, ctx));
            });

            pageTemplate = template.templateFunction({ widgets: sortedWidgets, requestContext: appState.requestContext });
        }
    }

    if (!pageTemplate) {
        pageTemplate = appState.widgets.map((child) => {
            return RenderWidgetService.createComponent(child, appState.requestContext, ctx);
        });
    }

    return (
      <>
        <PageFrontEndUtilLoader metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} additionalQueryParams={{ sf_culture: layout.Culture, sf_site: isEdit || layout.Site.IsSubFolder ? layout.SiteId : ''}} />
        <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.Head} />
        <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.BodyTop} />
        {isEdit && <RenderPageClient layout={layout} metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} context={appState.requestContext} />}
        {!isEdit && appState.requestContext.layout?.ComponentContext.HasLazyComponents && <RenderLazyWidgetsClient metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} url={liveUrl} />}
        {pageTemplate}
        <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.BodyBottom} />
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
