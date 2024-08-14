import { RequestContext } from '../request-context';
import { deepCopy } from '../utils/object-utils';
import { WidgetMetadataBase } from './widget-metadata';
import { WidgetModel } from './widget-model';

export interface WidgetContext<T extends {[key: string]: any} = {[key: string]: any}> {
    readonly model: WidgetModel<T>;
    readonly requestContext: RequestContext;
    readonly metadata: WidgetMetadataBase;
    readonly traceContext?: any;
}

export function getMinimumWidgetContext<T extends {[key: string]: any} = {[key: string]: any}>(widgetContext: WidgetContext<T>): WidgetContext<T> {
    return deepCopy({
        model: widgetContext.model,
        requestContext: widgetContext.requestContext,
        metadata: widgetContext.metadata,
        traceContext: null
    });
}
