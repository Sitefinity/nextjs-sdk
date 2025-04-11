import { EntityMetadataGenerator, MetadataModel, PropertyModel } from '@progress/sitefinity-widget-designers-sdk/metadata';
import { WidgetMetadata, WidgetViewsRegistration } from './widget-metadata';

export interface WidgetRegistry {
    widgets: {
        [key: string]: WidgetMetadata
    }
}

/**
 * @deprecated Used internally
 */
export function initRegistry(widgetRegistry: WidgetRegistry) {
    const widgets = Object.keys(widgetRegistry.widgets);

    widgets.forEach(widgetKey => {
        const widgetRegistration = widgetRegistry.widgets[widgetKey];

        if (widgetRegistration.entity == null && widgetRegistration.designerMetadata == null) {
            throw new Error(`There should be either entity or designer metadata provided for ${widgetKey} widget`);
        }

        const metadata: MetadataModel = widgetRegistration.entity ? EntityMetadataGenerator.extractMetadata(widgetRegistration.entity) : widgetRegistration.designerMetadata;
        addViewChoices(widgetRegistration, metadata);
        if (!widgetRegistration.entity) {
            return;
        }

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
        widgetRegistration.defaultValues ||= EntityMetadataGenerator.extractDefaultValues(metadata) || {};

        delete widgetRegistration.entity;
    });

    return widgetRegistry;
}

/**
 * Adds custom views to a chosen widget in the widget registry. Existing key entries will be replaced.
 * @param widgetRegistry The widget registry object
 * @param widgetKey The key of the widget in the registry
 * @param views The views object that is to be added
 */
export function addWidgetViews(widgetRegistry: WidgetRegistry, widgetKey: string, views: WidgetViewsRegistration) {
    const widgetResistration: WidgetMetadata = widgetRegistry.widgets[widgetKey];
    widgetResistration.views = {...(widgetResistration.views || {}), ...views};
}

function addViewChoices(widgetRegistration: WidgetMetadata, metadata: MetadataModel | undefined) {
    if (!(widgetRegistration.templates || widgetRegistration.views) || !metadata) {
        return;
    }

    const propertyMetadataFlat = metadata.PropertyMetadata.flatMap(pm => pm.Sections.flatMap(s => s.Properties));

    // TODO: implement a regex in the @ViewSelector to filter views based on it. See the impl in .NetCore renderer for reference
    const viewSelectorsProps = propertyMetadataFlat.filter(p => p.Type === 'viewSelector' && p.Name !== 'SfDetailViewName');
    const SfDetailViewNameProp = propertyMetadataFlat.find(p => p.Name === 'SfDetailViewName');
    viewSelectorsProps.forEach(x => addWidgetViewsChoices(x, widgetRegistration, (viewName: string) => !viewName.toLowerCase().startsWith('details.')));
    addWidgetViewsChoices(SfDetailViewNameProp, widgetRegistration, (viewName: string) => viewName.toLowerCase().startsWith('details.'));

    if (metadata.PropertyMetadataFlat) {
        metadata.PropertyMetadataFlat = propertyMetadataFlat;
    }
}

function addWidgetViewsChoices(property: PropertyModel | undefined, widgetRegistration: WidgetMetadata, viewFilter: (view: string) => boolean) {
    if (!property) {
        return;
    }

    let defaultViews = [];
    if (property.Properties['Meta_Choices']) {
        defaultViews = JSON.parse(property.Properties['Meta_Choices']);
    }

    let views = widgetRegistration.views || {};

    // Fallback for deprecated 'templates' props. Remove this code once the prop is removed.
    if (widgetRegistration.templates) {
        views = { ...views, ...widgetRegistration.templates};
    }

    const customViews = Object.keys(views!).filter(viewFilter).map(viewName => {
        const resultView = {
            Title: viewName,
            Name: viewName,
            Value: viewName,
            Icon: null
        };

        const view = views![viewName];
        if (typeof view === 'object') {
            resultView.Title = view.Title;
        }

        return resultView;
    });

    const uniqueViews = getUniqueViewChoices([...customViews, ...defaultViews]);

    property.Properties = {
        ...property.Properties,
        'Meta_Choices': JSON.stringify(uniqueViews),
        'Meta_Choices_AllowMultiple': 'False'
    };
}

function getUniqueViewChoices(choices: { Value: string }[]) {
    const uniqueViews: { Value: string }[] = [];
    choices.forEach(view => {
        const isPresent = uniqueViews.some((uView) => uView.Value === view.Value);
        if (!isPresent) {
            uniqueViews.push(view);
        }
    });

    return uniqueViews;
}
