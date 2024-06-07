import { RequestContext } from '../request-context';
import { WidgetMetadata } from './widget-metadata';
import { WidgetModel } from './widget-model';

export interface WidgetContext<T> {
    readonly model: WidgetModel<T>;
    readonly requestContext: RequestContext;
    readonly metadata: WidgetMetadata;
    readonly traceContext?: any;
}
