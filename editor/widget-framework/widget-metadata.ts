import { deepCopy } from '../utils/object-utils';
import { EditorMetadata } from './widget-editor-metadata';

export interface WidgetMetadataBase {
    designerMetadata?: any;
    editorMetadata?: EditorMetadata;
    ssr?: boolean;
}
export interface WidgetMetadata extends WidgetMetadataBase {
    componentType: any;
    entity?: any;

    /**
     * @deprecated: Use 'views' property instead.
     */
    templates?: { [key: string]: Function | { Title: string, ViewFunction: Function } };
    views?: { [key: string]: Function | { Title: string, ViewFunction: Function } };
}

export function getMinimumMetadata(metadata: WidgetMetadata, isEdit: boolean): WidgetMetadataBase {
    if (!isEdit) {
        return {
            ssr: metadata?.ssr
        };
    }

    return deepCopy({
        designerMetadata: metadata?.designerMetadata,
        editorMetadata: metadata?.editorMetadata,
        ssr: metadata?.ssr
    });
}
