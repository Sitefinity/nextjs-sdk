import { deepCopy } from '../utils/object-utils';
import { EditorMetadata } from './widget-editor-metadata';

export type WidgetViewsRegistration = { [key: string]: Function | { Title: string, ViewFunction: Function } };

export interface WidgetMetadataBase {
    designerMetadata?: any;
    editorMetadata?: EditorMetadata;
    ssr?: boolean;
    defaultValues?: any;
}

export interface WidgetMetadata extends WidgetMetadataBase {
    componentType: any;
    entity?: any;

    /**
     * @deprecated: Use 'views' property instead.
     */
    templates?: WidgetViewsRegistration;
    views?: WidgetViewsRegistration;
}

export function getMinimumMetadata(metadata: WidgetMetadata, isEdit: boolean): WidgetMetadataBase {
    if (!isEdit) {
        return {
            ssr: metadata?.ssr
        };
    }

    return deepCopy<WidgetMetadataBase>({
        designerMetadata: metadata?.designerMetadata,
        defaultValues: metadata?.defaultValues,
        editorMetadata: metadata?.editorMetadata,
        ssr: metadata?.ssr
    });
}
