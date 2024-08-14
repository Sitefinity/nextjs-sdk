import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { Dictionary } from '../../typings/dictionary';

export interface ViewPropsBase<T extends {[key: string]: any} = {[key: string]: any}> {
    widgetContext: WidgetContext<T>;
    attributes: Dictionary;
}
