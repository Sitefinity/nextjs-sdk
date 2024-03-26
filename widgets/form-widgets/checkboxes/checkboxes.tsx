import React from 'react';
import { CheckboxesClient, CheckboxesClientViewModel } from './checkboxes-client';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { CheckboxesEntity } from './checkboxes.entity';

export function Checkboxes(props: WidgetContext<CheckboxesEntity>) {
    const dataAttributes = htmlAttributes(props);

    const defaultRendering = (<CheckboxesDefaultRender entity={props.model.Properties} />);
    return  (props.requestContext.isEdit
        ? <div {...dataAttributes}> {defaultRendering} </div>
        :defaultRendering);
}

export function CheckboxesDefaultRender(props: { entity: CheckboxesEntity }) {
    const checkboxUniqueId = props.entity.SfFieldName as string;
    const entity = props.entity;

    const viewModel: CheckboxesClientViewModel = {
        Choices: entity.Choices || [],
        CssClass: entity.CssClass || '',
        HasAdditionalChoice: entity.HasAdditionalChoice,
        InstructionalText: entity.InstructionalText || '',
        Label: entity.Label || '',
        Required: entity.Required,
        RequiredErrorMessage: entity.RequiredErrorMessage
    };

    let layoutClass = '';
    let innerColumnClass = '';
    const parsed = parseInt(entity.ColumnsNumber.toString(), 10);
    switch (parsed) {
        case 0:
            layoutClass = 'd-flex flex-wrap';
            innerColumnClass = 'me-2';
            break;
        case 2:
            layoutClass = 'row m-0';
            innerColumnClass = 'col-6';
            break;
        case 3:
            layoutClass = 'row m-0';
            innerColumnClass = 'col-4';
            break;
        default:
            break;
    }
    const inputCheckboxUniqueId = getUniqueId(checkboxUniqueId);
    const otherChoiceOptionId = getUniqueId(`choiceOption-other-${checkboxUniqueId}`);

    return (<>
      <script data-sf-role={`start_field_${checkboxUniqueId}`} data-sf-role-field-name={`${checkboxUniqueId}`} />
      <CheckboxesClient viewModel={viewModel}
        checkboxUniqueId={checkboxUniqueId}
        inputCheckboxUniqueId={inputCheckboxUniqueId}
        otherChoiceOptionId={otherChoiceOptionId}
        innerColumnClass={innerColumnClass}
        layoutClass={layoutClass}
        />
      <script data-sf-role={`end_field_${checkboxUniqueId}`} />
    </>
    );
}
