import { ParagraphClient } from './paragraph-client';
import { ParagraphViewProps } from './paragraph.view-props';
import { ParagraphEntity } from './paragraph.entity';

export function ParagraphDefaultTemplate(props: ParagraphViewProps<ParagraphEntity>) {
  const paragraphUniqueId = props.widgetContext.model.Properties.SfFieldName;
  const defaultRendering = (<><script data-sf-role={`start_field_${paragraphUniqueId}`} data-sf-role-field-name={paragraphUniqueId} />
    <ParagraphClient {...props} />
    <script data-sf-role={`end_field_${paragraphUniqueId}`} /></>);

return (
  <>
    { props.widgetContext.requestContext.isEdit ? <div {...props.attributes}> {defaultRendering} </div>
        :defaultRendering }
  </>
);
}
