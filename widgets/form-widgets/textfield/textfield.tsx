import { TextType } from './interfaces/text-type';
import { StylingConfig } from '../../styling/styling-config';
import { TextFieldClient } from './textfield-client';
import { classNames } from '../../../editor/utils/classNames';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { TextFieldEntity } from './text-field.entity';
import { TextFieldViewModel } from './text-field-viewmodel';

const InvalidDefaultValidationMessage = '{0} field is invalid';

export function TextField(props: WidgetContext<TextFieldEntity>) {
    const entity = props.model.Properties;
    const viewModel: TextFieldViewModel = {
        CssClass: classNames(entity.CssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || null,
        FieldName: entity.SfFieldName,
        HasDescription: !entity.InstructionalText,
        InputType: entity.InputType === TextType.Phone ? 'tel' : entity.InputType.toLowerCase(),
        Label: entity.Label,
        PlaceholderText: entity.PlaceholderText,
        InstructionalText: entity.InstructionalText,
        PredefinedValue: entity.PredefinedValue,
        ValidationAttributes: buildValidationAttributes(entity),
        ViolationRestrictionsJson: {
            maxLength: entity.Range?.Max || null,
            minLength: entity.Range?.Min || null
        },
        ViolationRestrictionsMessages: {
            invalid: InvalidDefaultValidationMessage.replace('{0} ', ''),
            invalidLength: entity.TextLengthViolationMessage,
            regularExpression: entity.RegularExpressionViolationMessage,
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

        if (entity.RegularExpressionViolationMessage) {
            viewModel.ViolationRestrictionsMessages.regularExpression = entity.RegularExpressionViolationMessage.replace('{0}', entity.Label);
        }
    }

    const textBoxUniqueId = entity.SfFieldName;
    const textBoxErrorMessageId = getUniqueId('TextboxErrorMessage');
    const textBoxInfoMessageId = getUniqueId('TextboxInfo');
    const ariaDescribedByAttribute = viewModel.HasDescription ? `${textBoxUniqueId} ${textBoxErrorMessageId}` : textBoxErrorMessageId;
    const dataAttributes = htmlAttributes(props);
    const defaultRendering = (<>
      <script data-sf-role={`start_field_${textBoxUniqueId}`} data-sf-role-field-name={textBoxUniqueId} />
      <TextFieldClient viewModel={viewModel}
        textBoxUniqueId={textBoxUniqueId}
        textBoxErrorMessageId={textBoxErrorMessageId}
        textBoxInfoMessageId={textBoxInfoMessageId}
        ariaDescribedByAttribute={ariaDescribedByAttribute} />
      <script data-sf-role={`end_field_${textBoxUniqueId}`} />
    </>);
     return (props.requestContext.isEdit
        ? <div {...dataAttributes}> {defaultRendering} </div>
        :defaultRendering);
}

function buildValidationAttributes(entity: TextFieldEntity) {
    const validationAttributes: {[key: string]: string} = {};

    if (entity.Required) {
     validationAttributes['required'] = 'required';
    }

    if (entity.RegularExpression) {
       validationAttributes['pattern'] = entity.RegularExpression;
    }

    return validationAttributes;
 }
