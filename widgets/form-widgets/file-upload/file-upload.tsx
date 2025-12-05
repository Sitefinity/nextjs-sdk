import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { FileUploadEntity } from './file-upload.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { FileUploadViewProps } from './interface/file-upload.view-props';
import { RenderView } from '../../common/render-view';
import { FileUploadDefaultView } from './file-upload.view';

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
        if (type === 'All') {
            return null;
        }

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
    const { span } = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;
    const allowedFileTypes = getAcceptedFileTypes(entity);
    const viewProps: FileUploadViewProps<FileUploadEntity> = {
        allowMultipleFiles: entity.AllowMultipleFiles,
        cssClass: entity.CssClass || '',
        fieldName: entity.SfFieldName!,
        fileSizeViolationMessage: entity.FileSizeViolationMessage,
        fileTypeViolationMessage: entity.FileTypeViolationMessage,
        instructionalText: entity.InstructionalText || '',
        label: entity.Label,
        required: entity.Required,
        requiredErrorMessage: entity.RequiredErrorMessage || '',
        minFileSizeInMb: entity.Range?.Min || 0,
        maxFileSizeInMb: entity.Range?.Max || 0,
        allowedFileTypes: allowedFileTypes || [],
        validationAttributes: entity.Required ? { 'required': 'required'} : {},
        violationRestrictionsJson:  {
            maxSize: entity.Range?.Max,
            minSize: entity.Range?.Min,
            required: entity.Required,
            allowMultiple: entity.AllowMultipleFiles,
            allowedFileTypes: allowedFileTypes
        },
        attributes: htmlAttributes(props),
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={props.model.Properties.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <FileUploadDefaultView {...viewProps} />
      </RenderView>
    );
}
