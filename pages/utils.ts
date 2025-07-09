import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { PageParams } from './page-params';
import { RestClient } from '../rest-sdk/rest-client';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { LayoutResponse } from '../rest-sdk/dto/layout-service.response';
import { ErrorCodeException } from '../rest-sdk/errors/error-code.exception';
import { GetPageLayoutArgs } from '../rest-sdk/args/get-page-layout.args';

export async function pageLayout({ params, searchParams, relatedFields, traceContext }: PageParams): Promise<LayoutResponse> {
    const pageParams = params instanceof Promise ? await params : params;
    const queryParams = searchParams instanceof Promise ? await searchParams : searchParams;
    try {
        const args: GetPageLayoutArgs = {
            pagePath: pageParams?.slug.join('/'),
            queryParams,
            cookie: (await cookies()).toString(),
            followRedirects: false,
            relatedFields,
            traceContext
        };

        const layout = await RestClient.getPageLayout(args);
        return layout;
    } catch (error) {
        if (error instanceof ErrorCodeException) {
            throw error;
        }

        if (typeof error === 'string') {
            throw error;
        }

        throw `Could not fetch layout for url -> ${pageParams?.slug.join('/')}`;
    }
}

export async function pageMetadata({ params, searchParams }: PageParams): Promise<Metadata> {
    const pageParams = params instanceof Promise ? await params : params;
    let layoutResponse: LayoutResponse | null = null;

    if (/^sitefinity\/(template|forms)/i.test(pageParams?.slug.join('/'))) {
        return {};
    }

    if (pageParams && pageParams.slug && pageParams.slug.length > 0) {
        if (pageParams.slug.some(x => x === '_next') || pageParams.slug[pageParams.slug.length - 1].indexOf('.') !== -1) {
            return {};
        }
    }

    try {
        layoutResponse = await pageLayout({ params, searchParams });
    } catch (error) {
        return {};
    }

    if (layoutResponse.isRedirect) {
        return {};
    }

    const layout = layoutResponse.layout;
    if (layout?.MetaInfo) {
        const result: Metadata = {
            title: layout.MetaInfo.Title,
            description: layout.MetaInfo.Description,
            openGraph: {
                title: layout.MetaInfo.OpenGraphTitle,
                description: layout.MetaInfo.OpenGraphDescription,
                images: [
                    {
                        url: layout.MetaInfo.OpenGraphImage
                    }
                ],
                videos: [
                    {
                        url: layout.MetaInfo.OpenGraphVideo
                    }
                ],
                siteName: layout.MetaInfo.OpenGraphSite
            },
            alternates: {
                canonical: layout.MetaInfo.CanonicalUrl
            },
            robots: layout?.Fields && layout.Fields.Crawlable === false ? { index: false } : undefined
        };

        // hack to check ogTypes. Otherwise and error is thrown and the whole page does not render
        const ogTypes = ['article', 'book', 'music.song', 'music.album', 'music.playlist', 'music.radio_station', 'profile', 'website', 'video.tv_show', 'video.other', 'video.movie', 'video.episode'];
        if (layout.MetaInfo.OpenGraphType && ogTypes.indexOf(layout.MetaInfo.OpenGraphType) > -1) {
            (result.openGraph as any).type = layout.MetaInfo.OpenGraphType;
        }

        // only in sfcloud
        if (process?.env?.SF_NEXTJS_SET_CACHE_CONTROL_METATAG && layout.CacheControl) {
            result.other = {
                'Sf-Cache-Control': layout.CacheControl
            };
        }

        return result;
    }

    return {};
}

/**
 * @deprecated Not needed anymore
 */
export function initRendering(widgetRegistry: WidgetRegistry, errorComponentType: any) {
    // RenderWidgetService.widgetRegistry = widgetRegistry;
}
