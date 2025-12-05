import { NumberFieldClient } from './number-field-client';
import { NumberFieldEntity } from './number-field.entity';
import { NumberFieldViewProps } from './number-field.view-props';

export function NumberFieldDefaultView(props: NumberFieldViewProps<NumberFieldEntity>) {
    const numberFieldUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const defaultRendering = (<><script data-sf-role={`start_field_${numberFieldUniqueId}`} data-sf-role-field-name={numberFieldUniqueId} />
      <NumberFieldClient {...props} />
      <script data-sf-role={`end_field_${numberFieldUniqueId}`} /></>);

return (
  <>
    { props.widgetContext.requestContext.isEdit ? <div {...props.attributes}> {defaultRendering} </div>
        :defaultRendering }
  </>
);
}
