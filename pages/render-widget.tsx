
import { RenderWidgetService } from '../services/render-widget-service';
import { RequestContext } from '../editor/request-context';
import { RestClient } from '../rest-sdk/rest-client';
import { initRestSdk } from '../rest-sdk/init';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';

export async function RenderWidget({ searchParams }: { searchParams: { [key: string]: string } }) {
    const headersList = headers();
    RestClient.host = headersList.get('host');

    await initRestSdk();
    const widgetId = searchParams['widgetId'];
    const itemId = searchParams['itemId'];
    const itemType = searchParams['itemType'];
    const widgetSegmentId = searchParams['widgetSegmentId'];
    const segmentId = searchParams['segment'];


    const isEdit = searchParams['sfaction'] === 'edit';
    const isPreview = searchParams['sfaction'] === 'preview';
    const isLive = !(isEdit || isPreview);
    const pageUrl = searchParams['pageUrl'] as string;

    let path = pageUrl;
    let query = '';
    const questionmarkIndex = pageUrl.indexOf('?');
    if (questionmarkIndex > -1) {
        path = pageUrl.substring(0, questionmarkIndex);
        query = pageUrl.substring(questionmarkIndex);
    }

    let params = new URLSearchParams(query);
    const paramsAsObject = Object.fromEntries(params);

    const layoutResponse = await RestClient.getPageLayout({
        pagePath: path,
        queryParams: paramsAsObject,
        cookie: cookies().toString(),
        followRedirects: true
    });

    const layout = layoutResponse.layout!;

    RestClient.contextQueryParams = {
        sf_culture: layout.Culture,
        sf_site: isEdit ? layout.SiteId : ''
    };

    const widgetModel = await RestClient.getWidgetModel({
        id: itemId,
        type: itemType,
        widgetId,
        widgetSegmentId,
        segmentId,
        additionalHeaders: {'Cookie': cookies().toString()} });

    if (!widgetModel) {
        notFound();
    }

    const requestContext: RequestContext = {
        layout: layout,
        searchParams: paramsAsObject,
        isEdit,
        isPreview,
        isLive,
        culture: layout.Culture,
        url: path
    };

    return (
      <div id="widgetPlaceholder">
        {RenderWidgetService.createComponent(widgetModel, requestContext)}
      </div>
    );
}
