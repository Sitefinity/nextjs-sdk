import { RenderWidgetService } from '../services/render-widget-service';
import { RequestContext } from '../editor/request-context';
import { RestClient } from '../rest-sdk/rest-client';
import { cookies, headers } from 'next/headers';
import { LayoutResponse } from '../rest-sdk/dto/layout-service.response';
import { PageItem } from '../rest-sdk/dto/page-item';
import { setHostServerContext } from '../services/server-context';
import { initServerSideRestSdk } from '../rest-sdk/init';
import { Dictionary } from '../typings/dictionary';
import { widgetRegistry } from '@widgetregistry';
import { initRegistry } from '../editor/widget-framework/widget-registry';

export async function RenderLazyWidgets({ searchParams }: { searchParams: Dictionary | Promise<Dictionary> }) {
    if (!RenderWidgetService.widgetRegistry) {
      RenderWidgetService.widgetRegistry = initRegistry(widgetRegistry);
    }

    const hostHeader = (await headers()).get('host') || '';
    const queryParams = searchParams instanceof Promise ? await searchParams : searchParams;
    setHostServerContext(hostHeader);

    const pageUrl = queryParams['pageUrl'];
    const cookie = (await cookies()).toString();

    const lazyWidgets = await RestClient.getLazyWidgets({
        url: pageUrl,
        correlationId: queryParams['correlationId'],
        referrer: queryParams['referrer'],
        cookie: cookie
    });

    lazyWidgets.forEach(x => x.Lazy = false);

    let path = pageUrl;
    let query = '';
    const questionMarkIndex = pageUrl.indexOf('?');
    if (questionMarkIndex > -1) {
        path = pageUrl.substring(0, questionMarkIndex);
        query = pageUrl.substring(questionMarkIndex);
    }

    const params = new URLSearchParams(query);
    const paramsAsObject = Object.fromEntries(params);

    const layoutResponse = await RestClient.getPageLayout({
        pagePath: path,
        queryParams: paramsAsObject,
        cookie: cookie,
        followRedirects: true
    }) as LayoutResponse;

    const layout = layoutResponse.layout!;
    await initServerSideRestSdk({ metadataHash: layout.MetadataHash });

    const requestContext: RequestContext = {
        layout: layout,
        searchParams: queryParams,
        isEdit: false,
        isPreview: false,
        isLive: true,
        culture: layout.Culture,
        url: path,
        pageNode: layout.Fields as PageItem
    };

    return (
      <div id="widgetPlaceholder">
        <>
          {
            lazyWidgets.map((lazy) => {
              const widgetEntry = RenderWidgetService.widgetRegistry.widgets[lazy.Name];
              if (widgetEntry && !widgetEntry.ssr) {
                return (<div key={lazy.Id} id={lazy.Id} data-sfmodel={true}>
                  {JSON.stringify(lazy)}
                </div>);
              }
                return (
                  <div key={lazy.Id} id={lazy.Id}>
                    {RenderWidgetService.createComponent(lazy, requestContext)}
                  </div>
                );
            })
            }
        </>
      </div>
    );
}
