import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { ParagraphEntity } from './paragraph.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../../common/render-view';
import { ParagraphDefaultTemplate } from './paragraph.view';
import { ParagraphViewProps } from './paragraph.view-props';

const InvalidDefaultValidationMessageWithLabel = '{0} field is invalid';
const InvalidDefaultValidationMessage = 'Field is invalid';

export function Paragraph(props: WidgetContext<ParagraphEntity>) {
    const { span } = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;

    const viewProps: ParagraphViewProps<ParagraphEntity> = {
        cssClass: classNames(entity.CssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || null,
        fieldName: entity.SfFieldName,
        hasDescription: !entity.InstructionalText,
        label: entity.Label,
        placeholderText: entity.PlaceholderText,
        instructionalText: entity.InstructionalText,
        predefinedValue: entity.PredefinedValue,
        validationAttributes: entity.Required ? { 'required': 'required' } : {},
        violationRestrictionsJson: {
            maxLength: entity.Range?.Max || null,
            minLength: entity.Range?.Min || null
        },
        violationRestrictionsMessages: {
            invalid: InvalidDefaultValidationMessage,
            invalidLength: entity.TextLengthViolationMessage,
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

        viewProps.violationRestrictionsMessages.invalid = InvalidDefaultValidationMessageWithLabel.replace('{0}', entity.Label);
    }

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <ParagraphDefaultTemplate {...viewProps}/>
      </RenderView>
    );
}

