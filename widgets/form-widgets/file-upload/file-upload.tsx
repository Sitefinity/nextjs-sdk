import React from 'react';
import { FileUploadClient, FileUploadViewModel } from './file-upload-client';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { FileUploadEntity } from './file-upload.entity';

const predefinedAcceptValues: {[key: string]: string[]} = {
    'Audio': [ '.mp3', '.ogg', '.wav', '.wma' ],
    'Video': [ '.avi', '.mpg', '.mpeg', '.mov', '.mp4', '.wmv' ],
    'Image': [ '.jpg', '.jpeg', '.png', '.gif', '.bmp' ],
    'Document': [ '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.pps', '.ppsx', '.xls', '.xlsx' ]
};
const getAcceptedFileTypes = (entity: FileUploadEntity): string[] | null => {
            const parsedArray: string[] = [];
            const fileTypes = entity.FileTypes;
            if (!fileTypes || !fileTypes.Type) {
                return null;
            }

            const types = fileTypes.Type.split(',').map(x => x.trim());

            for (const type of types) {
                if (predefinedAcceptValues[type]) {
                    parsedArray.push(...predefinedAcceptValues[type]);
                }

                if (type === 'Other') {
                    const fileTypesSplit = fileTypes.Other?.split(',')
                        .map(t => t.trim().toLowerCase())
                        .map(t => t.startsWith('.') ? t : '.' + t);
                    if (fileTypesSplit) {
                        parsedArray.push(...fileTypesSplit);
                    }
                }
            }

            return parsedArray;
        };

export function FileUpload(props: WidgetContext<FileUploadEntity>) {
    const entity = props.model.Properties;
    const context = props.requestContext;
    const allowedFileTypes = getAcceptedFileTypes(entity);
    const viewModel: FileUploadViewModel = {
        AllowMultipleFiles: entity.AllowMultipleFiles,
        CssClass: entity.CssClass || '',
        FieldName: entity.SfFieldName!,
        FileSizeViolationMessage: entity.FileSizeViolationMessage,
        FileTypeViolationMessage: entity.FileTypeViolationMessage,
        InstructionalText: entity.InstructionalText || '',
        Label: entity.Label,
        Required: entity.Required,
        RequiredErrorMessage: entity.RequiredErrorMessage || '',
        MinFileSizeInMb: entity.Range?.Min || 0,
        MaxFileSizeInMb: entity.Range?.Max || 0,
        AllowedFileTypes: allowedFileTypes || [],
        ValidationAttributes: entity.Required ? { 'required': 'required'} : {},
        ViolationRestrictionsJson:  {
            maxSize: entity.Range?.Max,
            minSize: entity.Range?.Min,
            required: entity.Required,
            allowMultiple: entity.AllowMultipleFiles,
            allowedFileTypes: allowedFileTypes
        }
    };
    const fileFieldUniqueId = entity.SfFieldName!;
    const fileFieldErrorMessageId = getUniqueId('FileFieldErrorMessage');
    const fileFieldInfoMessageId = getUniqueId('FileFieldInfo');
    const dataAttributes = htmlAttributes(props);
    const defaultRendering = (<>
      <script data-sf-role={`start_field_${fileFieldUniqueId}`} data-sf-role-field-name={fileFieldUniqueId} />
      <FileUploadClient viewModel={viewModel}
        fileFieldUniqueId={fileFieldUniqueId}
        fileFieldErrorMessageId={fileFieldErrorMessageId}
        fileFieldInfoMessageId={fileFieldInfoMessageId}
        context={context}
        />
      <script data-sf-role={`end_field_${fileFieldUniqueId}`} />
    </>);
     return (props.requestContext.isEdit
        ? <div {...dataAttributes}> {defaultRendering} </div>
        :defaultRendering);
}
