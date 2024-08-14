import { ViewPropsBase } from '../../common/view-props-base';
import { ChoiceOption } from '../common/choice-option';
import { ChoiceEntityBase } from './choice-entity-base';

export interface ChoiceViewPropsBase<T extends ChoiceEntityBase> extends ViewPropsBase<T> {
    choices: ChoiceOption[],
    required: boolean;
    requiredErrorMessage: string;
    cssClass: string;
    label: string;
    instructionalText: string;
    sfFieldName: string;
}
