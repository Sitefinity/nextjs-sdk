import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { MultipleChoiceClient, MultipleChoiceClientViewModel } from './multiple-choice-client';
import { MultipleChoiceEntity } from './multiple-choice.entity';

export function MultipleChoice(props: WidgetContext<MultipleChoiceEntity>) {
    const entity = props.model.Properties;
    const viewModel: MultipleChoiceClientViewModel = {
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
    const multipleChoiceUniqueId = entity.SfFieldName!;
    const inputMultipleChoiceUniqueId = getUniqueId(multipleChoiceUniqueId);
    const otherChoiceOptionId = getUniqueId(`choiceOption-other-${multipleChoiceUniqueId}`);
    const dataAttributes = htmlAttributes(props);
    const defaultRendering = (
      <>
        <script data-sf-role={`start_field_${multipleChoiceUniqueId}`} data-sf-role-field-name={`${multipleChoiceUniqueId}`} />
        <MultipleChoiceClient viewModel={viewModel}
          multipleChoiceUniqueId={multipleChoiceUniqueId}
          inputMultipleChoiceUniqueId={inputMultipleChoiceUniqueId}
          otherChoiceOptionId={otherChoiceOptionId}
          innerColumnClass={innerColumnClass}
          layoutClass={layoutClass}
           />
        <script data-sf-role={`end_field_${multipleChoiceUniqueId}`} />
      </>
    );
    return (props.requestContext.isEdit
        ? <div {...dataAttributes}> {defaultRendering} </div>
        :defaultRendering);
}
