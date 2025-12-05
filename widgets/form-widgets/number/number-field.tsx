import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { RenderView } from '../../common/render-view';
import { StylingConfig } from '../../styling/styling-config';
import { NumberFieldEntity } from './number-field.entity';
import { NumberFieldViewProps } from './number-field.view-props';
import { NumberFieldDefaultView } from './number-field.view';
import { AffixType } from './interfaces/affix-type';

const InvalidDefaultValidationMessageWithLabel = '{0} field is invalid';
const InvalidDefaultValidationMessage = 'Field is invalid';
const DecimalsAreNotAllowedValidationMessage = 'Decimals are not allowed';

export function NumberField(props: WidgetContext<NumberFieldEntity>) {
	const { span } = Tracer.traceWidget(props, false);
	const entity = props.model.Properties;
	let affixType: AffixType = AffixType.none;
	if (entity.PrefixOrSuffix?.choiceValue) {
		affixType = entity.PrefixOrSuffix.choiceValue;
	}

	const widthCssClass = (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)];
	let containerWidthCss = entity.FieldSize !== 'XS' ? widthCssClass : '';
	let inputWidthCss = entity.FieldSize === 'XS' ? widthCssClass : '';
	const viewProps: NumberFieldViewProps<NumberFieldEntity> = {
		cssClass: classNames(entity.CssClass, containerWidthCss) || null,
		inputCssClass: inputWidthCss,
		fieldName: entity.SfFieldName,
		hasDescription: !entity.InstructionalText,
		label: entity.Label,
		placeholderText: entity.PlaceholderText,
		instructionalText: entity.InstructionalText,
		predefinedValue: entity.PredefinedValue,
		validationAttributes: buildValidationAttributes(entity),
		allowDecimals: entity.AllowDecimals,
		affixType: affixType,
		affixText: entity.PrefixOrSuffix?.textValue || '',
		violationRestrictionsJson: {
			maxValue: entity.ValueRange?.Max || null,
			minValue: entity.ValueRange?.Min || null
		},
		violationRestrictionsMessages: {
			invalid: InvalidDefaultValidationMessage,
			invalidRange: entity.ValueRangeViolationMessage,
			required: entity.RequiredErrorMessage,
			step: DecimalsAreNotAllowedValidationMessage
		},
		attributes: { ...htmlAttributes(props) },
		widgetContext: getMinimumWidgetContext(props)
	};

	if (entity.Label) {
		if (entity.ValueRangeViolationMessage) {
			viewProps.violationRestrictionsMessages.invalidRange = entity.ValueRangeViolationMessage?.replace('{0}', entity.Label);
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
    <NumberFieldDefaultView {...viewProps} />
  </RenderView>
	);
}

function buildValidationAttributes(entity: NumberFieldEntity) {
	const validationAttributes: { [key: string]: string } = {};

	if (entity.Required) {
		validationAttributes['required'] = 'required';
	}

	validationAttributes['step'] = entity.AllowDecimals ? 'any' : '1';

	if (entity.ValueRange?.Min || entity.ValueRange?.Min === 0) {
		validationAttributes['min'] = entity.ValueRange.Min.toString();
	}

	if (entity.ValueRange?.Max || entity.ValueRange?.Max === 0) {
		validationAttributes['max'] = entity.ValueRange.Max.toString();
	}

	return validationAttributes;
}
