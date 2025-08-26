import React from 'react';
import { TransferableRequestContext } from '../editor/request-context';
import { WidgetContext, getMinimumRequestContext, getMinimumWidgetContext } from '../editor/widget-framework/widget-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { LazyComponent } from '../widgets/lazy/lazy-component';
import { deepCopy } from '../editor/utils/object-utils';
import { EntityMetadataGenerator } from '@progress/sitefinity-widget-designers-sdk/metadata';
import { WidgetMetadata, getMinimumMetadata } from '../editor/widget-framework/widget-metadata';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ErrorBoundaryCustom } from '../pages/error-boundary';
import { WidgetExecutionError } from '../widgets/error/widget-execution-error-component';

/**
 * RenderWidgetService is a class that provides methods to render widgets in the Sitefinity Next.js framework.
 * It is responsible for rendering the widget components and handling their properties and context. Both server-side and client-side rendering are supported.
 * The class uses the WidgetRegistry to find the appropriate widget component and its metadata.
 */
export class RenderWidgetService {
    public static widgetRegistry: WidgetRegistry;

    /**
     * 
     * @param {WidgetModel} widgetModel The widget model containing the widget's metadata and properties.
     * @param {TransferableRequestContext} requestContext A {RequestContext} object containing the request context for the current page render. The request context contains information about the current request, such as the layout, search parameters, and culture.
     * @param {any} [traceContext] Optional OpenTelemetry Context trace context for logging and diagnostics. If needed, the parent trace context can be passed to the widget in order to wrap the current trace data in the passed parent context. 
     * @returns {React.ReactElement} The rendered widget component as a React element. If the widget is not found in the registry, an error message is returned. If the widget is in edit mode and an error occurs during rendering, an error component is returned instead. If the widget is not found and not in edit mode, no error is returned and null will be rendered.
     */
    public static createComponent(widgetModel: WidgetModel, requestContext: TransferableRequestContext, traceContext?: any) {
        Tracer.logEvent(`render widget start: ${widgetModel.Caption || widgetModel.Name}`);
        const registeredType = RenderWidgetService.widgetRegistry.widgets[widgetModel.Name];

        const propsForWidget: WidgetContext = {
            metadata: getMinimumMetadata(registeredType, requestContext.isEdit), // modify props to remove functions in order to pass them to client component
            model: deepCopy(widgetModel),
            requestContext: getMinimumRequestContext(deepCopy<TransferableRequestContext>(requestContext)),
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

                const errorElement = React.createElement(WidgetExecutionError, errorProps);
                return errorElement;
            }

            return null;
        }
    }

    public static parseProperties(widgetProperties: {[key: string]: any}, widgetMetadata: WidgetMetadata) {
        const defaultValues = widgetMetadata.defaultValues || {};
        const persistedProperties = widgetMetadata?.designerMetadata ? EntityMetadataGenerator.parseValues(widgetProperties, widgetMetadata.designerMetadata) : {};

        return Object.assign({}, defaultValues, persistedProperties);
    }
}
