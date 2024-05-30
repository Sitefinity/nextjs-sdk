
import { RenderPageClient } from './render-page-client';
import { pageLayout } from './utils';
import { AppState } from './app-state';
import { RenderWidgetService } from '../services/render-widget-service';
import { RenderLazyWidgetsClient } from './render-lazy-widgets.client';
import { RenderPageScripts } from './render-page-scripts';
import { Dictionary } from '../typings/dictionary';
import { ServiceMetadata } from '../rest-sdk/service-metadata';
import { RestClient } from '../rest-sdk/rest-client';
import { headers } from 'next/headers';
import { ErrorCodeException } from '../rest-sdk/errors/error-code.exception';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { LayoutResponse } from '../rest-sdk/dto/layout-service.response';
import { PageScriptLocation } from '../rest-sdk/dto/scripts';
import { PageFrontEndUtilLoader } from './page-frontend-util-loader';

export async function RenderPage({ params, searchParams, relatedFields }: { params: { slug: string[] }, searchParams: Dictionary, relatedFields?: string[] }) {
    const headersList = headers();
    RestClient.host = headersList.get('host');

    let layoutResponse: LayoutResponse | null = null;

    if (params) {
        if (params.slug.some(x => x === '_next') || params.slug[params.slug.length - 1].indexOf('.') !== -1) {
            notFound();
        }
    }

    try {
        layoutResponse = await pageLayout({ params, searchParams, relatedFields });
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

    const layout = layoutResponse.layout;
    const isEdit = searchParams['sfaction'] === 'edit';
    const isPreview = searchParams['sfaction'] === 'preview';
    const isLive = !(isEdit || isPreview);

    const appState : AppState = {
        requestContext: {
            layout: layout,
            searchParams: searchParams,
            detailItem: layout.DetailItem,
            culture: layout.Culture,
            isEdit,
            isPreview,
            isLive,
            url: params.slug.join('/')
        },
        widgets: layout.ComponentContext.Components
    };

    RestClient.contextQueryParams = {
        sf_culture: layout.Culture,
        sf_site: isEdit ? layout.SiteId : ''
    };

    const liveUrl = params.slug.join('/') + '?' + new URLSearchParams(searchParams).toString();

    return (
      <>
        <PageFrontEndUtilLoader metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} />
        <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.Head} />
        <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.BodyTop} />
        {isEdit && <RenderPageClient layout={layout} metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} context={appState.requestContext} />}
        {!isEdit && appState.requestContext.layout?.ComponentContext.HasLazyComponents && <RenderLazyWidgetsClient metadata={ServiceMetadata.serviceMetadataCache} taxonomies={ServiceMetadata.taxonomies} url={liveUrl} />}
        {appState.widgets.map((child) => {
                return RenderWidgetService.createComponent(child, appState.requestContext);
            })}
        <RenderPageScripts layout={layout} scriptLocation={PageScriptLocation.BodyBottom} />
      </>
    );
}
