'use client';

import { DropdownDefaultRender } from '../dropdown/dropdown';
import { CheckboxesDefaultRender } from '../checkboxes/checkboxes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { DynamicListEntity } from './dynamic-list.entity';
import { CheckboxesEntity } from '../checkboxes/checkboxes.entity';
import { DropdownEntity } from '../dropdown/dropdown.entity';
import { htmlAttributes, setWarning } from '../../../editor/widget-framework/attributes';
import { getChoiceItems } from './dynamic-list-view-model';
import { ChoiceEntityBase } from '../interfaces/choice-entity-base';
import { useEffect, useState } from 'react';

export function DynamicListCSR(props: WidgetContext<DynamicListEntity>) {
    const entity = props.model.Properties;
    const hasContent = entity.SelectedContent != null && entity.SelectedContent.Content != null && entity.SelectedContent.Content[0].Type;
    const dataAttributes = htmlAttributes(props);

    const [defaultRender, setRender] = useState<JSX.Element | null>(null);

    if (props.requestContext.isEdit && !hasContent) {
        setWarning(dataAttributes, 'No list type have been selected');
    }

    useEffect(() => {
        const baseEntity: ChoiceEntityBase = {
            Choices: [],
            CssClass: entity.CssClass,
            Hidden: entity.Hidden,
            InstructionalText: entity.InstructionalText,
            SfFieldName: entity.SfFieldName,
            Required: entity.Required,
            RequiredErrorMessage: entity.RequiredErrorMessage || '',
            SfViewName: 'Default',
            Label: entity.Label || ''
        };

        getChoiceItems(entity).then(choices => {
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
        
                setRender(<DropdownDefaultRender entity={dropdownEntity} />);
            } else {
                const checkboxesEntity: CheckboxesEntity = {
                    ...baseEntity,
                    Choices: choices,
                    ColumnsNumber: entity.ColumnsNumber,
                    HasAdditionalChoice: false,
                    SfFieldType: 'Checkboxes'
                };
        
                setRender(<CheckboxesDefaultRender entity={checkboxesEntity} /> );
            }

            if (props.requestContext.isEdit && hasContent && choices.length === 0) {
                setWarning(dataAttributes, 'Selected list is empty');
            }
            
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (props.requestContext.isEdit) {
        return (
          <div {...dataAttributes}>
            {defaultRender}
          </div>
        );
    }

    return defaultRender;
}
