'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { DynamicListEntity } from './dynamic-list.entity';
import { CheckboxesEntity } from '../checkboxes/checkboxes.entity';
import { DropdownEntity } from '../dropdown/dropdown.entity';
import { htmlAttributes, setWarning } from '../../../editor/widget-framework/attributes';
import { getChoiceItems } from './dynamic-list.view-props';
import { ChoiceEntityBase } from '../interfaces/choice-entity-base';
import { useEffect, useState } from 'react';
import { DropdownDefaultView } from '../dropdown/dropdown.view';
import { CheckboxesDefaultView } from '../checkboxes/checkboxes.view';
import { DropdownViewProps } from '../dropdown/interfaces/dropdown.view-props';
import { CheckboxesViewProps } from '../checkboxes/interfaces/checkboxes-view-model';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';

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

                const cssClass = entity.CssClass || '';
                const viewProps: DropdownViewProps<DropdownEntity> = {
                    choices: choices || [],
                    cssClass: classNames(cssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || '',
                    instructionalText: entity.InstructionalText!,
                    label: entity.Label || '',
                    required: entity.Required,
                    requiredErrorMessage: entity.RequiredErrorMessage || '',
                    fieldSize: entity.FieldSize,
                    sorting: 'Manual',
                    sfFieldName: entity.SfFieldName,
                    attributes: {},
                    widgetContext: {
                        requestContext: props.requestContext,
                        model: {
                            Id: props.model.Id
                        }
                    } as any
                };

                setRender(<DropdownDefaultView {...viewProps} />);
            } else {
                const viewProps: CheckboxesViewProps<CheckboxesEntity> = {
                    choices: choices || [],
                    cssClass: entity.CssClass || '',
                    hasAdditionalChoice: false,
                    instructionalText: entity.InstructionalText || '',
                    label: entity.Label || '',
                    required: entity.Required,
                    requiredErrorMessage: entity.RequiredErrorMessage!,
                    columnsNumber: entity.ColumnsNumber,
                    sfFieldName: entity.SfFieldName!,
                    attributes: {},
                    widgetContext: {
                        requestContext: props.requestContext,
                        model: {
                            Id: props.model.Id
                        }
                    } as any
                };

                setRender(<CheckboxesDefaultView {...viewProps} /> );
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
