import { RequestContext, TransferableRequestContext } from '../request-context';
import { deepCopy } from '../utils/object-utils';
import { WidgetMetadataBase } from './widget-metadata';
import { WidgetModel } from './widget-model';

export interface WidgetContext<T extends {[key: string]: any} = {[key: string]: any}> {
    readonly model: WidgetModel<T>;
    readonly requestContext: TransferableRequestContext;
    readonly metadata: WidgetMetadataBase;
    readonly traceContext?: any;
}

export function getMinimumRequestContext (requestContext: RequestContext): TransferableRequestContext {
    const context: TransferableRequestContext = {...requestContext, ...{
        layout: {
            Culture: requestContext.layout.Culture,
            SiteId: requestContext.layout.SiteId,
            Id: requestContext.layout.Id,
            MetaInfo: requestContext.layout.MetaInfo,
            UrlParameters: requestContext.layout.UrlParameters,
            Fields: requestContext.layout.Fields,
            Site: requestContext.layout.Site
        }
    }};

    return context;
}

export function getMinimumWidgetContext<T extends {[key: string]: any} = {[key: string]: any}>(widgetContext: WidgetContext<T>  ): WidgetContext<T> {
    return deepCopy({
        model: widgetContext.model,
        requestContext: getMinimumRequestContext(widgetContext.requestContext as RequestContext),
        metadata: widgetContext.metadata,
        traceContext: null
    });
}
