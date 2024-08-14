import { CheckboxesClient } from './checkboxes-client';
import { CheckboxesEntity } from './checkboxes.entity';
import { CheckboxesViewProps } from './interfaces/checkboxes-view-model';

export function CheckboxesDefaultView(props: CheckboxesViewProps<CheckboxesEntity>) {
  const defaultRendering = (<><script data-sf-role={`start_field_${props.sfFieldName}`} data-sf-role-field-name={`${props.sfFieldName}`} />
    <CheckboxesClient {...props} />
    <script data-sf-role={`end_field_${props.sfFieldName}`} /></>);
    return (
      <>
        { props.widgetContext.requestContext.isEdit ? <div {...props.attributes}> {defaultRendering} </div>
            :defaultRendering }
      </>
    );
  }
