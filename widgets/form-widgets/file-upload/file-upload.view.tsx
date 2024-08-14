import { FileUploadClient } from './file-upload-client';
import { FileUploadEntity } from './file-upload.entity';
import { FileUploadViewProps } from './interface/file-upload.view-props';

export function FileUploadDefaultView(props: FileUploadViewProps<FileUploadEntity>) {
  const defaultRendering = (
    <>
      <script data-sf-role={`start_field_${props.fieldName}`} data-sf-role-field-name={props.fieldName} />
      <FileUploadClient {...props}/>
      <script data-sf-role={`end_field_${props.fieldName}`} />
    </>);

  return (
    <>
      { props.widgetContext.requestContext.isEdit
        ? <div {...props.attributes}> {defaultRendering} </div>
        :defaultRendering }
    </>
  );
}
