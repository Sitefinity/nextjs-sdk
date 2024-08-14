import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { DropdownEntity } from './dropdown.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../../common/render-view';
import { DropdownDefaultView } from './dropdown.view';
import { DropdownViewProps } from './interfaces/dropdown.view-props';
import { classNames } from '../../../editor/utils/classNames';
import { StylingConfig } from '../../styling/styling-config';
import { ChoiceOption } from '../common/choice-option';

export function Dropdown(props: WidgetContext<DropdownEntity>) {
	const { span } = Tracer.traceWidget(props, false);
	const entity = props.model.Properties;

	let choices = entity.Choices || [];
	if (entity.Sorting === 'Alphabetical') {
        choices = choices.sort((a: ChoiceOption, b: ChoiceOption) => a.Name.localeCompare(b.Name));
    }

	const cssClass = entity.CssClass || '';
	const viewProps: DropdownViewProps<DropdownEntity> = {
		choices: choices,
		cssClass: classNames(cssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || '',
		instructionalText: entity.InstructionalText!,
		label: entity.Label || '',
		required: entity.Required,
		requiredErrorMessage: entity.RequiredErrorMessage || '',
		sorting: entity.Sorting,
		sfFieldName: entity.SfFieldName!,
		fieldSize: entity.FieldSize,
		attributes: { ...htmlAttributes(props) },
		widgetContext: getMinimumWidgetContext(props)
	};

	return (
  <RenderView
    viewName={entity.SfViewName!}
    widgetKey={props.model.Name}
    traceSpan={span}
    viewProps={viewProps}>
    <DropdownDefaultView {...viewProps} />
  </RenderView>
	);
}
