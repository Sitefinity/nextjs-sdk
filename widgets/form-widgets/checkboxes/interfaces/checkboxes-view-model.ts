import { ChoiceViewPropsBase } from '../../interfaces/choice-view-props-base';
import { CheckboxesEntity } from '../checkboxes.entity';

export interface CheckboxesViewProps<T extends CheckboxesEntity> extends ChoiceViewPropsBase<T> {
    hasAdditionalChoice: boolean;
    columnsNumber: number;
}
