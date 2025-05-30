
import { RenderWidgetService } from '../services/render-widget-service';
import { RequestContext } from '../editor/request-context';
import { RestClient, RestSdkTypes } from '../rest-sdk/rest-client';
import { initServerSideRestSdk } from '../rest-sdk/init';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { PageItem } from '../rest-sdk/dto/page-item';
import { setHostServerContext } from '../services/server-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { Dictionary } from '../typings/dictionary';
import { widgetRegistry } from '@widgetregistry';
import { initRegistry } from '../editor/widget-framework/widget-registry';
import { EMTPY_GUID } from '../editor/utils/guid';

export async function RenderWidget({ searchParams }: { searchParams: Dictionary | Promise<Dictionary> }) {
    if (!RenderWidgetService.widgetRegistry) {
        RenderWidgetService.widgetRegistry = initRegistry(widgetRegistry);
    }

    const host = (await headers()).get('host') || '';
    const queryParams = searchParams instanceof Promise ? await searchParams : searchParams;
    setHostServerContext(host);

    const widgetId = queryParams['widgetId'];
    const itemId = queryParams['itemId'];
    const itemType = queryParams['itemType'];
    const widgetSegmentId = queryParams['widgetSegmentId'];
    const segmentId = queryParams['segment'];


    const isEdit = queryParams['sfaction'] === 'edit';
    const isPreview = queryParams['sfaction'] === 'preview';
    const isLive = !(isEdit || isPreview);
    const pageUrl = queryParams['pageUrl'] as string;

    let path = pageUrl;
    let query = '';
    const questionmarkIndex = pageUrl.indexOf('?');
    if (questionmarkIndex > -1) {
        path = pageUrl.substring(0, questionmarkIndex);
        query = pageUrl.substring(questionmarkIndex);
    }

    let params = new URLSearchParams(query);
    const paramsAsObject = Object.fromEntries(params);

    const cookie = (await cookies()).toString();

    const layoutResponse = await RestClient.getPageLayout({
        pagePath: path,
        queryParams: paramsAsObject,
        cookie,
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
    if (itemType !== RestSdkTypes.Form && widgetSegmentId !== 'undefined' && widgetSegmentId !== 'null') {
        widgetModel = await RestClient.getLazyWidget({
            id: itemId,
            type: itemType,
            widgetId,
            widgetSegmentId,
            segmentId,
            additionalHeaders: { 'Cookie': cookie }
        });
    }

    if (!widgetModel && isEdit && !(widgetSegmentId && widgetSegmentId !== 'undefined' && widgetSegmentId !== 'null' && widgetSegmentId !== EMTPY_GUID)) {
        widgetModel = await RestClient.getWidgetModel({
            id: itemId,
            type: itemType,
            widgetId,
            widgetSegmentId,
            segmentId,
            additionalHeaders: { 'Cookie': cookie }
        });
    }

    if (!widgetModel) {
        return notFound();
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
