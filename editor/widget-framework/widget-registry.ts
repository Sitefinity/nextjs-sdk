import { EntityMetadataGenerator } from '@progress/sitefinity-widget-designers-sdk';
import { WidgetMetadata } from './widget-metadata';

export interface WidgetRegistry {
    widgets: {
        [key: string]: WidgetMetadata
    }
}

export function initRegistry(widgetRegistry: WidgetRegistry) {
    const widgets = Object.keys(widgetRegistry.widgets);

    widgets.forEach(widgetKey => {
        const widgetRegistration = widgetRegistry.widgets[widgetKey];

        if (widgetRegistration.entity == null && widgetRegistration.designerMetadata == null) {
            throw new Error(`There should be either entity or designer metadata provided for ${widgetKey} widget`);
        }

        const metadata = EntityMetadataGenerator.extractMetadata(widgetRegistration.entity);
        if (widgetRegistration.entity) {
            const editorMetadata = widgetRegistration.editorMetadata;
            if (metadata && editorMetadata) {
                if (editorMetadata.Name) {
                    metadata.Name = editorMetadata.Name;
                }

                if (editorMetadata.Title) {
                    metadata.Caption = editorMetadata.Title ?? editorMetadata.Name;
                }

                if (editorMetadata.Toolbox === 'Forms') {
                    const propertyMetadataFlat = metadata.PropertyMetadataFlat;
                    const initialProperties = widgetRegistration.editorMetadata?.InitialProperties;
                    if (propertyMetadataFlat && initialProperties) {
                        const labelProperty = propertyMetadataFlat.find(prop => prop.Name === 'Label' && prop.DefaultValue);
                        if (labelProperty) {
                            initialProperties['Label'] = labelProperty.DefaultValue;
                        }
                    }
                }
            }

            widgetRegistration.designerMetadata = metadata;

            delete widgetRegistration.entity;
        }
    });

    return widgetRegistry;
}
