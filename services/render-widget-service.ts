import React from 'react';
import { RequestContext } from '../editor/request-context';
import { WidgetContext } from '../editor/widget-framework/widget-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { LazyComponent } from '../widgets/lazy/lazy-component';
import { EntityMetadataGenerator, PropertyModel } from '@progress/sitefinity-widget-designers-sdk';
import { WidgetMetadata } from '../editor/widget-framework/widget-metadata';

export class RenderWidgetService {
    public static widgetRegistry: WidgetRegistry;
    public static errorComponentType: any;

    public static createComponent(widgetModel: WidgetModel<any>, requestContext: RequestContext) {
        const registeredType = RenderWidgetService.widgetRegistry.widgets[widgetModel.Name];

        const propsForWidget: WidgetContext<any> = {
            metadata: registeredType,
            model: widgetModel,
            requestContext: requestContext
        };

        try {
            RenderWidgetService.parseProperties(propsForWidget.model, registeredType);
            let componentType = registeredType.componentType;
            if (!requestContext.isEdit && widgetModel.Lazy) {
                componentType = LazyComponent;
            }

            const element = React.createElement(componentType, { key: widgetModel.Id, ...propsForWidget });
            return element;
        } catch (err) {
            if (requestContext.isEdit) {
                const errCast = err as Error;
                const errorProps = {
                    context: propsForWidget,
                    error: errCast.message
                };

                const errorElement = React.createElement(RenderWidgetService.errorComponentType, errorProps);
                return errorElement;
            }

            return null;
        }
    }

    public static parseProperties(widgetModel: WidgetModel<any>, widgetMetadata: WidgetMetadata) {
        const defaultValues = EntityMetadataGenerator.extractDefaultValues(widgetMetadata?.designerMetadata) || {};
        const persistedProperties = widgetMetadata?.designerMetadata ? EntityMetadataGenerator.parseValues(widgetModel.Properties, widgetMetadata.designerMetadata) : {};

        widgetModel.Properties = Object.assign(defaultValues, persistedProperties);
    }
}
