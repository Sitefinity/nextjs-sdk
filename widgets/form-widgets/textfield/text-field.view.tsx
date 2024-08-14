import { TextFieldViewProps } from './text-field.view-props';
import { TextFieldEntity } from './text-field.entity';
import { TextFieldClient } from './textfield-client';

export function TextFieldDefaultView(props: TextFieldViewProps<TextFieldEntity>) {
    const textBoxUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const defaultRendering = (<><script data-sf-role={`start_field_${textBoxUniqueId}`} data-sf-role-field-name={textBoxUniqueId} />
      <TextFieldClient {...props} />
      <script data-sf-role={`end_field_${textBoxUniqueId}`} /></>);

return (
  <>
    { props.widgetContext.requestContext.isEdit ? <div {...props.attributes}> {defaultRendering} </div>
        :defaultRendering }
  </>
);
}
