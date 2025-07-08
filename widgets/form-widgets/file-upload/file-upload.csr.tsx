'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { FileUpload } from './file-upload';
import { FileUploadEntity } from './file-upload.entity';

export function FileUploadCSR(props: WidgetContext<FileUploadEntity>) {
    return FileUpload(props);
}
