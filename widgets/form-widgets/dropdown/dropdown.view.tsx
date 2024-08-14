import { DropdownFieldSet } from './dropdown-client';
import { DropdownEntity } from './dropdown.entity';
import { DropdownViewProps } from './interfaces/dropdown.view-props';

export function DropdownDefaultView(props: DropdownViewProps<DropdownEntity>) {
  const defaultRendering = (<><script data-sf-role={`start_field_${props.sfFieldName}`} data-sf-role-field-name={props.sfFieldName} />
    <DropdownFieldSet {...props} />
    <script data-sf-role={`end_field_${props.sfFieldName}`} /></>);
	return (
  <>
    { props.widgetContext.requestContext.isEdit ? <div {...props.attributes}> {defaultRendering} </div>
          :defaultRendering }
  </>
);
}
