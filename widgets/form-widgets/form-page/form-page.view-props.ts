import { WidgetModel } from '../../../editor/widget-framework/widget-model';
import { ViewPropsBase } from '../../common/view-props-base';
import { FormPageEntity } from './form-page.entity';

export interface FormPageChildComponent {
    model: WidgetModel<any>;
}

export interface FormPageViewProps<T extends FormPageEntity> extends ViewPropsBase<T> {
    pageLabel: string;
    buttonLabel: string;
    allowStepBackward: boolean;
    backLinkLabel: string;
    cssClass: string | null;
    isEdit: boolean;
    children: FormPageChildComponent[];
}
