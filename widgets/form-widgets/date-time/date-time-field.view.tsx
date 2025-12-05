import { DateTimeFieldClient } from './date-time-field-client';
import { DateTimeFieldEntity } from './date-time-field.entity';
import { DateTimeFieldViewProps } from './date-time-field.view-props';

export function DateTimeFieldDefaultView(props: DateTimeFieldViewProps<DateTimeFieldEntity>) {
    const dateTimeFieldUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const defaultRendering = (<><script data-sf-role={`start_field_${dateTimeFieldUniqueId}`} data-sf-role-field-name={dateTimeFieldUniqueId} />
      <DateTimeFieldClient {...props} />
      <script data-sf-role={`end_field_${dateTimeFieldUniqueId}`} /></>);

return (
  <>
    { props.widgetContext.requestContext.isEdit ? <div {...props.attributes}> {defaultRendering} </div>
        :defaultRendering }
  </>
);
}
