import React from 'react';
import { RequestContext } from '../editor/request-context';
import { WidgetContext } from '../editor/widget-framework/widget-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { LazyComponent } from '../widgets/lazy/lazy-component';
import { EntityMetadataGenerator } from '@progress/sitefinity-widget-designers-sdk';
import { WidgetMetadata } from '../editor/widget-framework/widget-metadata';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ErrorBoundaryCustom } from '../pages/error-boundary';

export class RenderWidgetService {
    public static widgetRegistry: WidgetRegistry;
    public static errorComponentType: any;

    public static createComponent(widgetModel: WidgetModel<any>, requestContext: RequestContext, traceContext?: any) {
        Tracer.logEvent(`render widget start: ${widgetModel.Caption || widgetModel.Name}`);
        const registeredType = RenderWidgetService.widgetRegistry.widgets[widgetModel.Name];

        const propsForWidget: WidgetContext<any> = {
            metadata: registeredType,
            model: widgetModel,
            requestContext,
            traceContext: registeredType?.ssr ? traceContext : null
        };

        try {
            if (!registeredType) {
                throw new Error(`No widget named "${widgetModel.Name}" found in the registry`);
            }

            RenderWidgetService.parseProperties(propsForWidget.model, registeredType);
            let componentType = registeredType.componentType;
            if (!requestContext.isEdit && widgetModel.Lazy) {
                componentType = LazyComponent;
            }

            const element = React.createElement(componentType, { key: widgetModel.Id, ...propsForWidget });

            // modify props to remove functions in otder to pass them to client component
            const propsCopy = JSON.parse(JSON.stringify(propsForWidget));
            propsCopy.metadata.componentType = null;
            propsCopy.metadata.designerMetadata = null;
            const result = React.createElement(ErrorBoundaryCustom, { key: 'err' + widgetModel.Id, children: element, context: propsCopy });
            return result;
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
