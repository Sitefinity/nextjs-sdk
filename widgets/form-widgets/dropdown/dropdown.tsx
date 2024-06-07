import { DropdownFieldSet, DropdownViewModel } from './dropdown-client';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { DropdownEntity } from './dropdown.entity';
import { ChoiceOption } from '../common/choice-option';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export function Dropdown(props: WidgetContext<DropdownEntity>) {
	const { span } = Tracer.traceWidget(props, false);
	const dataAttributes = htmlAttributes(props);
	const defaultRendering = (<DropdownDefaultRender entity={props.model.Properties} />);
	return (
  <>
    { props.requestContext.isEdit
		? <div {...dataAttributes}> {defaultRendering} </div>
		: defaultRendering }
    { Tracer.endSpan(span) }
  </>
		);
}

export function DropdownDefaultRender(props: { entity: DropdownEntity }) {
	const entity = props.entity;
	const dropdownUniqueId = entity.SfFieldName as string;

	const viewModel: DropdownViewModel = {
		Choices: entity.Choices || [],
		CssClass: entity.CssClass || '',
		InstructionalText: entity.InstructionalText!,
		Label: entity.Label || '',
		Required: entity.Required,
		RequiredErrorMessage: entity.RequiredErrorMessage || ''
	};

    if (entity.Sorting === 'Alphabetical') {
        viewModel.Choices = viewModel.Choices.sort((a: ChoiceOption, b: ChoiceOption) => a.Name.localeCompare(b.Name));
    }

    viewModel.CssClass = classNames(entity.CssClass, (StylingConfig.FieldSizeClasses as { [key: string]: string })[('Width' + entity.FieldSize)]) || '';

	return (<>
  <script data-sf-role={`start_field_${dropdownUniqueId}`} data-sf-role-field-name={dropdownUniqueId} />
  <DropdownFieldSet viewModel={viewModel} dropdownUniqueId={dropdownUniqueId} />
  <script data-sf-role={`end_field_${dropdownUniqueId}`} />
	</>);
}
