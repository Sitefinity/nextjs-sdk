import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { RedirectType, notFound, permanentRedirect, redirect } from 'next/navigation';
import { PageParams } from './page-params';
import { ServiceMetadata } from '../rest-sdk/service-metadata';
import { RenderWidgetService } from '../services/render-widget-service';
import { RestClient } from '../rest-sdk/rest-client';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { GetAllArgs } from '../rest-sdk/args/get-all.args';
import { LayoutResponse, LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';
import { initRestSdk } from '../rest-sdk/init';
import { ErrorCodeException } from '../rest-sdk/errors/error-code.exception';
import { GetPageLayoutArgs } from '../rest-sdk/args/get-page-layout.args';
import { RedirectResponse } from '../rest-sdk/dto/redirect.response';

export async function pageLayout({ params, searchParams }: PageParams): Promise<LayoutResponse> {
    await initRestSdk();
    const pagePath = params.slug.join('/');

    try {
        const args: GetPageLayoutArgs = {
            pagePath: params.slug.join('/'),
            queryParams: searchParams,
            cookie: cookies().toString(),
            followRedirects: false
        };

        // adding X-SF-Access-Key header so the layout service can return responce in edit
        if (!args.cookie && process.env['SF_ACCESS_KEY']) {
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

        throw `Could not fetch layout for url -> ${pagePath}`;
    }
}

export async function pageMetadata({ params, searchParams }: PageParams): Promise<Metadata> {

    let layoutResponse: LayoutResponse | null = null;

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
        return {
            title: layout.MetaInfo.Title,
            description: layout.MetaInfo.Description,

            other: {
                'og-title': layout.MetaInfo.OpenGraphTitle,
                'og-image': layout.MetaInfo.OpenGraphImage,
                'og-video': layout.MetaInfo.OpenGraphVideo,
                'og-type': layout.MetaInfo.OpenGraphType,
                'og-site': layout.MetaInfo.OpenGraphSite
            }
        };
    }

    return {};
}

export async function pageStaticParams() {
    const getAllArgs: GetAllArgs = {
        skip: 0,
        take: 50,
        count: true,
        fields: ['ViewUrl', 'Renderer'],
        type: 'Telerik.Sitefinity.Pages.Model.PageNode'
    };

    await ServiceMetadata.fetch();

    const filteredItems = [];
    while (true) {
        let items = await RestClient.getItems(getAllArgs);
        let response = items.Items;
        if (response.length === 0) {
            break;
        }

        let filtered = response.filter(x => x['Renderer'] === 'React').map(x => x['ViewUrl']);
        if (filtered.length > 0) {
            filteredItems.push(...filtered);
        }

        getAllArgs.skip = (getAllArgs.skip as number) + (getAllArgs.take as number);
    }

    return filteredItems.map((relativeUrl) => {
        return {
            slug: relativeUrl.split('/').splice(1)
        };
    });
}

export function initRendering(widgetRegistry: WidgetRegistry, errorComponentType: any) {
    RenderWidgetService.widgetRegistry = widgetRegistry;
    RenderWidgetService.errorComponentType = errorComponentType;
}
