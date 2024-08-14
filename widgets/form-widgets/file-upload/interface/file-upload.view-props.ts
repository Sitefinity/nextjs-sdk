import { ViewPropsBase } from '../../../common/view-props-base';
import { FileUploadEntity } from '../file-upload.entity';

export interface FileUploadViewProps<T extends FileUploadEntity> extends ViewPropsBase<T> {
    required: boolean;
    instructionalText: string;
    violationRestrictionsJson: any;
    label: string;
    validationAttributes: {[key: string]: string};
    fieldName: string;
    allowMultipleFiles: boolean;
    minFileSizeInMb: number;
    maxFileSizeInMb: number;
    fileSizeViolationMessage: string;
    allowedFileTypes: string[];
    cssClass: string;
    fileTypeViolationMessage: string;
    requiredErrorMessage: string;
}
