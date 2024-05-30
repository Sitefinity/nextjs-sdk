import { ParagraphClient } from './paragraph-client';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { ParagraphEntity } from './paragraph.entity';
import { TextFieldViewModel } from '../textfield/text-field-viewmodel';

const InvalidDefaultValidationMessageWithLabel = '{0} field is invalid';
const InvalidDefaultValidationMessage = 'Field is invalid';

export function Paragraph(props: WidgetContext<ParagraphEntity>) {
    const entity = props.model.Properties;

    const viewModel: TextFieldViewModel = {
        CssClass: classNames(entity.CssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || null,
        FieldName: entity.SfFieldName,
        HasDescription: !entity.InstructionalText,
        Label: entity.Label,
        PlaceholderText: entity.PlaceholderText,
        InstructionalText: entity.InstructionalText,
        PredefinedValue: entity.PredefinedValue,
        ValidationAttributes: entity.Required ? { 'required': 'required' } : {},
        ViolationRestrictionsJson: {
            maxLength: entity.Range?.Max || null,
            minLength: entity.Range?.Min || null
        },
        ViolationRestrictionsMessages: {
            invalid: InvalidDefaultValidationMessage,
            invalidLength: entity.TextLengthViolationMessage,
            required: entity.RequiredErrorMessage
        }
    };

    if (entity.Label) {
        if (entity.TextLengthViolationMessage) {
            viewModel.ViolationRestrictionsMessages.invalidLength = entity.TextLengthViolationMessage?.replace('{0}', entity.Label);
        }

        if (entity.RequiredErrorMessage) {
            viewModel.ViolationRestrictionsMessages.required = entity.RequiredErrorMessage.replace('{0}', entity.Label);
        }

        viewModel.ViolationRestrictionsMessages.invalid = InvalidDefaultValidationMessageWithLabel.replace('{0}', entity.Label);
    }

    const paragraphUniqueId = entity.SfFieldName;
    const paragraphErrorMessageId = getUniqueId('ParagraphErrorMessage');
    const paragraphInfoMessageId = getUniqueId('ParagraphInfo');
    let ariaDescribedByAttribute = '';

    if (viewModel.InstructionalText) {
        if (viewModel.InstructionalText) {
            ariaDescribedByAttribute = `${paragraphUniqueId} ${paragraphErrorMessageId}`;
        } else {
            ariaDescribedByAttribute = paragraphErrorMessageId;
        }
    }

    const dataAttributes = htmlAttributes(props);
    const defaultRendering = (<>
      <script data-sf-role={`start_field_${paragraphUniqueId}`} data-sf-role-field-name={paragraphUniqueId} />
      <ParagraphClient viewModel={viewModel}
        paragraphUniqueId={paragraphUniqueId}
        paragraphErrorMessageId={paragraphErrorMessageId}
        paragraphInfoMessageId={paragraphInfoMessageId}
        ariaDescribedByAttribute={ariaDescribedByAttribute}
        />
      <script data-sf-role={`end_field_${paragraphUniqueId}`} />
    </>);
    return (props.requestContext.isEdit
        ? <div {...dataAttributes}> {defaultRendering} </div>
        : defaultRendering);
}

