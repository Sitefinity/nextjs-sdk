import { TableView, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';
import { MultipleChoiceEntity } from '../multiple-choice/multiple-choice.entity';
import { ChoiceOption } from '../common/choice-option';

@WidgetEntity('SitefinityCheckboxes', 'Checkboxes')
export class CheckboxesEntity extends MultipleChoiceEntity {
    @TableView({ Selectable: true, Reorderable: true, MultipleSelect: true })
    Choices: ChoiceOption[] | null = [
        { Name: 'First choice', Value: '1' }, 
        { Name: 'Second choice', Value: '2' }, 
        { Name: 'Third choice', Value: '3' }
    ];
}
