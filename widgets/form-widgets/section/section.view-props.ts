import { WidgetModel } from '../../../editor/widget-framework/widget-model';
import { Dictionary } from '../../../typings/dictionary';

export interface FormSectionColumnHolder {
    children: Array<FormSectionComponentContainer>
    attributes: Dictionary
}

export interface FormSectionComponentContainer {
    model: WidgetModel<any>;
}
