
import { RenderWidgetService } from '../services/render-widget-service';
import { RequestContext } from '../editor/request-context';
import { RestClient } from '../rest-sdk/rest-client';
import { cookies, headers } from 'next/headers';
import { LayoutResponse } from '../rest-sdk/dto/layout-service.response';
import { PageItem } from '../rest-sdk/dto/page-item';
import { setHostServerContext } from '../services/server-context';
import { initServerSideRestSdk } from '../rest-sdk/init';

export async function RenderLazyWidgets({ searchParams }: { searchParams: { [key: string]: string } }) {
    const hostHeader = headers().get('host') || '';
    setHostServerContext(hostHeader);

    const pageUrl = searchParams['pageUrl'];
    let cookie = cookies().toString();
    const lazyWidgets = await RestClient.getLazyWidgets({
        url: pageUrl,
        correlationId: searchParams['correlationId'],
        referrer: searchParams['referrer'],
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

    let params = new URLSearchParams(query);
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
        searchParams: searchParams,
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
