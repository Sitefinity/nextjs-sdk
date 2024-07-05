import { RequestContext } from '../request-context';
import { WidgetMetadataBase } from './widget-metadata';
import { WidgetModel } from './widget-model';

export interface WidgetContext<T extends {[key: string]: any} = {[key: string]: any}> {
    readonly model: WidgetModel<T>;
    readonly requestContext: RequestContext;
    readonly metadata: WidgetMetadataBase;
    readonly traceContext?: any;
}
