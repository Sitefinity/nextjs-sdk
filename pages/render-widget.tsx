
import { RenderWidgetService } from '../services/render-widget-service';
import { RequestContext } from '../editor/request-context';
import { RestClient } from '../rest-sdk/rest-client';
import { initServerSideRestSdk } from '../rest-sdk/init';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PageItem } from '../rest-sdk/dto/page-item';
import { setHostServerContext } from '../services/server-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { widgetRegistry } from '@widgetregistry';
import { initRegistry } from '../editor/widget-framework/widget-registry';

export async function RenderWidget({ searchParams }: { searchParams: { [key: string]: string } }) {
    if (!RenderWidgetService.widgetRegistry) {
        RenderWidgetService.widgetRegistry = initRegistry(widgetRegistry);
    }

    const host = headers().get('host') || '';
    setHostServerContext(host);

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
    await initServerSideRestSdk({
        metadataHash: layout.MetadataHash,
        queryParams: {
            sf_culture: layout.Culture,
            sf_site: isEdit || layout.Site.IsSubFolder ? layout.SiteId : ''
        }
    });

    let widgetModel: WidgetModel<any> | undefined;
    // lazy widget should be rendered in another way because getting the model is only possible in a locked state
    if (widgetSegmentId && widgetSegmentId !== 'undefined' && widgetSegmentId !== 'null' && widgetSegmentId !== '00000000-0000-0000-0000-000000000000') {
        widgetModel = await RestClient.getLazyWidget({
            id: itemId,
            type: itemType,
            widgetId,
            widgetSegmentId,
            segmentId,
            additionalHeaders: {'Cookie': cookies().toString()} });
    } else {
        widgetModel = await RestClient.getWidgetModel({
            id: itemId,
            type: itemType,
            widgetId,
            widgetSegmentId,
            segmentId,
            additionalHeaders: {'Cookie': cookies().toString()} });
    }

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
        url: path,
        pageNode: layout.Fields as PageItem
    };

    return (
      <div id="widgetPlaceholder">
        {RenderWidgetService.createComponent(widgetModel, requestContext)}
      </div>
    );
}
