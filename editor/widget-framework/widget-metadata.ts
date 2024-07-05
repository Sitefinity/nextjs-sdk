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
    templates?: { [key: string]: Function }
}

export function getMinimumMetadata(metadata: WidgetMetadata): WidgetMetadataBase {
    return deepCopy({
        designerMetadata: metadata?.designerMetadata,
        editorMetadata: metadata?.editorMetadata,
        ssr: metadata?.ssr
    });
}
