import { FieldSize } from '../../../styling/field-size';
import { ChoiceViewPropsBase } from '../../interfaces/choice-view-props-base';
import { DropdownEntity, DropdownSorting } from '../dropdown.entity';

export interface DropdownViewProps<T extends DropdownEntity> extends ChoiceViewPropsBase<T> {
    sorting: DropdownSorting;
    fieldSize: FieldSize;
}
