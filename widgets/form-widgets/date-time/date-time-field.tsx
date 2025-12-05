import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { RenderView } from '../../common/render-view';
import { DateTimeFieldViewProps } from './date-time-field.view-props';
import { DateTimeFieldEntity } from './date-time-field.entity';
import { DateTimeFieldDefaultView } from './date-time-field.view';
import { DateFieldType } from './interfaces/date-field-type';
import { HTMLInputTypeAttribute } from 'react';

const InvalidDefaultValidationMessageWithLabel = '{0} field is invalid';
const InvalidDefaultValidationMessage = 'Field is invalid';

export function DateTimeField(props: WidgetContext<DateTimeFieldEntity>) {
	const { span } = Tracer.traceWidget(props, false);
	const entity = props.model.Properties;

	const viewProps: DateTimeFieldViewProps<DateTimeFieldEntity> = {
		cssClass: entity.CssClass,
		fieldName: entity.SfFieldName,
		hasDescription: !entity.InstructionalText,
		label: entity.Label,
		inputType: getInputType(entity),
		instructionalText: entity.InstructionalText,
		validationAttributes: buildValidationAttributes(entity),
		violationRestrictionsMessages: {
			invalid: InvalidDefaultValidationMessage,
			required: entity.RequiredErrorMessage
		},
		attributes: { ...htmlAttributes(props) },
		widgetContext: getMinimumWidgetContext(props)
	};

	if (entity.Label) {
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
    <DateTimeFieldDefaultView {...viewProps} />
  </RenderView>
	);
}

function buildValidationAttributes(entity: DateTimeFieldEntity) {
	const validationAttributes: { [key: string]: string } = {};

	if (entity.Required) {
		validationAttributes['required'] = 'required';
	}

	return validationAttributes;
}

function getInputType(entity: DateTimeFieldEntity): HTMLInputTypeAttribute {
	switch (entity.FieldType) {
		case DateFieldType.DateTime: return 'datetime-local';
		case DateFieldType.DateOnly: return 'date';
		case DateFieldType.TimeOnly: return 'time';
		default: return 'date';
	}
}
