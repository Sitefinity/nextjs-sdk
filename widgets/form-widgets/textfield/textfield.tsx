import { TextType } from './interfaces/text-type';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { TextFieldEntity } from './text-field.entity';
import { TextFieldViewProps } from './text-field.view-props';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../../common/render-view';
import { TextFieldDefaultView } from './text-field.view';

const InvalidDefaultValidationMessageWithLabel = '{0} field is invalid';
const InvalidDefaultValidationMessage = 'Field is invalid';

export function TextField(props: WidgetContext<TextFieldEntity>) {
    const {span} = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;
    const viewProps: TextFieldViewProps<TextFieldEntity> = {
        cssClass: classNames(entity.CssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || null,
        fieldName: entity.SfFieldName,
        hasDescription: !entity.InstructionalText,
        inputType: entity.InputType === TextType.Phone ? 'tel' : entity.InputType.toLowerCase(),
        label: entity.Label,
        placeholderText: entity.PlaceholderText,
        instructionalText: entity.InstructionalText,
        predefinedValue: entity.PredefinedValue,
        validationAttributes: buildValidationAttributes(entity),
        violationRestrictionsJson: {
            maxLength: entity.Range?.Max || null,
            minLength: entity.Range?.Min || null
        },
        violationRestrictionsMessages: {
            invalid: InvalidDefaultValidationMessage,
            invalidLength: entity.TextLengthViolationMessage,
            regularExpression: entity.RegularExpressionViolationMessage,
            required: entity.RequiredErrorMessage
        },
        attributes: {...htmlAttributes(props)},
        widgetContext: getMinimumWidgetContext(props)
    };

    if (entity.Label) {
        if (entity.TextLengthViolationMessage) {
            viewProps.violationRestrictionsMessages.invalidLength = entity.TextLengthViolationMessage?.replace('{0}', entity.Label);
        }

        if (entity.RequiredErrorMessage) {
            viewProps.violationRestrictionsMessages.required = entity.RequiredErrorMessage.replace('{0}', entity.Label);
        }

        if (entity.RegularExpressionViolationMessage) {
            viewProps.violationRestrictionsMessages.regularExpression = entity.RegularExpressionViolationMessage.replace('{0}', entity.Label);
        }

        viewProps.violationRestrictionsMessages.invalid = InvalidDefaultValidationMessageWithLabel.replace('{0}', entity.Label);
    }

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <TextFieldDefaultView {...viewProps}/>
      </RenderView>
    );
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
