import { DropdownDefaultRender } from '../dropdown/dropdown';
import { CheckboxesDefaultRender } from '../checkboxes/checkboxes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { DynamicListEntity } from './dynamic-list.entity';
import { CheckboxesEntity } from '../checkboxes/checkboxes.entity';
import { DropdownEntity } from '../dropdown/dropdown.entity';
import { htmlAttributes, setWarning } from '../../../editor/widget-framework/attributes';
import { getChoiceItems } from './dynamic-list-view-model';
import { ChoiceEntityBase } from '../interfaces/choice-entity-base';

export async function DynamicList(props: WidgetContext<DynamicListEntity>) {
    const entity = props.model.Properties;
    const choices = await getChoiceItems(entity);
    let defaultRender: JSX.Element;

    const baseEntity: ChoiceEntityBase = {
        Choices: choices,
        CssClass: entity.CssClass,
        Hidden: entity.Hidden,
        InstructionalText: entity.InstructionalText,
        SfFieldName: entity.SfFieldName,
        Required: entity.Required,
        RequiredErrorMessage: entity.RequiredErrorMessage || '',
        SfViewName: 'Default',
        Label: entity.Label || ''
    };

    if (entity.SfViewName === 'Dropdown') {
        if (choices.length > 0) {
            choices.unshift({ Name: 'Select', Value: '', Selected: true });
        }

        const dropdownEntity: DropdownEntity = {
            ...baseEntity,
            Choices: choices,
            SfFieldType: 'Dropdown',
            FieldSize: entity.FieldSize,
            Sorting: 'Manual'
        };

        defaultRender = (<DropdownDefaultRender entity={dropdownEntity} />);
    } else {
        const checkboxesEntity: CheckboxesEntity = {
            ...baseEntity,
            ColumnsNumber: entity.ColumnsNumber,
            HasAdditionalChoice: false,
            SfFieldType: 'Checkboxes'
        };

        defaultRender = (<CheckboxesDefaultRender entity={checkboxesEntity} /> );
    }

    if (props.requestContext.isEdit) {
        const dataAttributes = htmlAttributes(props);

        if (entity.SelectedContent === null || entity.SelectedContent.Content === null || !entity.SelectedContent.Content[0].Type) {
            setWarning(dataAttributes, 'No list type have been selected');
        } else if (choices.length === 0) {
            setWarning(dataAttributes, 'Selected list is empty');
        }

        return (
          <div {...dataAttributes}>
            {defaultRender}
          </div>
        );
    }

    return defaultRender;
}
