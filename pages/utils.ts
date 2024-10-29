import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { PageParams } from './page-params';
import { RenderWidgetService } from '../services/render-widget-service';
import { RestClient } from '../rest-sdk/rest-client';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { LayoutResponse } from '../rest-sdk/dto/layout-service.response';
import { ErrorCodeException } from '../rest-sdk/errors/error-code.exception';
import { GetPageLayoutArgs } from '../rest-sdk/args/get-page-layout.args';

export async function pageLayout({ params, searchParams, relatedFields, traceContext }: PageParams): Promise<LayoutResponse> {
    try {
        const args: GetPageLayoutArgs = {
            pagePath: params.slug.join('/'),
            queryParams: searchParams,
            cookie: cookies().toString(),
            followRedirects: false,
            relatedFields,
            traceContext
        };

        // adding X-SF-Access-Key header so the layout service can return responce in edit
        if ((!args.cookie || process.env.NODE_ENV === 'test') && process.env['SF_ACCESS_KEY']) {
            args.additionalHeaders = {'X-SF-Access-Key': process.env['SF_ACCESS_KEY']};
        }

        const layout = await RestClient.getPageLayout(args);
        return layout;
    } catch (error) {
        if (error instanceof ErrorCodeException) {
            throw error;
        }

        if (typeof error === 'string') {
            throw error;
        }

        throw `Could not fetch layout for url -> ${params.slug.join('/')}`;
    }
}

export async function pageMetadata({ params, searchParams }: PageParams): Promise<Metadata> {
    let layoutResponse: LayoutResponse | null = null;

    if (/^sitefinity\/(template|forms)/i.test(params.slug.join('/'))) {
        return {};
    }

    if (params && params.slug && params.slug.length > 0) {
        if (params.slug.some(x => x === '_next') || params.slug[params.slug.length - 1].indexOf('.') !== -1) {
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

        return result;
    }

    return {};
}

export function initRendering(widgetRegistry: WidgetRegistry, errorComponentType: any) {
    RenderWidgetService.widgetRegistry = widgetRegistry;
    RenderWidgetService.errorComponentType = errorComponentType;
}
