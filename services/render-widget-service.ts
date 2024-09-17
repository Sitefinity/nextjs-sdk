import React from 'react';
import { TransferableRequestContext } from '../editor/request-context';
import { WidgetContext, getMinimumRequestContext, getMinimumWidgetContext } from '../editor/widget-framework/widget-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { LazyComponent } from '../widgets/lazy/lazy-component';
import { deepCopy } from '../editor/utils/object-utils';
import { EntityMetadataGenerator } from '@progress/sitefinity-widget-designers-sdk';
import { WidgetMetadata, getMinimumMetadata } from '../editor/widget-framework/widget-metadata';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ErrorBoundaryCustom } from '../pages/error-boundary';

export class RenderWidgetService {
    public static widgetRegistry: WidgetRegistry;
    public static errorComponentType: any;

    public static createComponent(widgetModel: WidgetModel, requestContext: TransferableRequestContext, traceContext?: any) {
        Tracer.logEvent(`render widget start: ${widgetModel.Caption || widgetModel.Name}`);
        const registeredType = RenderWidgetService.widgetRegistry.widgets[widgetModel.Name];

        const propsForWidget: WidgetContext = {
            metadata: getMinimumMetadata(registeredType, requestContext.isEdit), // modify props to remove functions in order to pass them to client component
            model: deepCopy(widgetModel),
            requestContext: getMinimumRequestContext(deepCopy(requestContext)),
            traceContext: registeredType?.ssr ? traceContext : null
        };

        try {
            if (!registeredType) {
                throw new Error(`No widget named "${widgetModel.Name}" found in the registry`);
            }

            propsForWidget.model.Properties = RenderWidgetService.parseProperties(propsForWidget.model.Properties, registeredType);
            let componentType = registeredType.componentType;
            if (!requestContext.isEdit && widgetModel.Lazy) {
                componentType = LazyComponent;
            }

            const element = React.createElement(componentType, { key: widgetModel.Id, ...propsForWidget });

            const propsForErrorBoundary = getMinimumWidgetContext(propsForWidget);
            const result = React.createElement(ErrorBoundaryCustom, { key: 'err' + widgetModel.Id, children: element, context: propsForErrorBoundary });
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

    public static parseProperties(widgetProperties: {[key: string]: any}, widgetMetadata: WidgetMetadata) {
        const defaultValues = EntityMetadataGenerator.extractDefaultValues(widgetMetadata?.designerMetadata) || {};
        const persistedProperties = widgetMetadata?.designerMetadata ? EntityMetadataGenerator.parseValues(widgetProperties, widgetMetadata.designerMetadata) : {};

        return Object.assign({}, defaultValues, persistedProperties);
    }
}
