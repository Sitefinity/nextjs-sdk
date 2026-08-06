import { JSX, ReactNode } from 'react';

import { TemplateRegistry } from '../editor/default-template-registry';
import { RequestContext } from '../editor/request-context';
import { WidgetModel } from '../editor/widget-framework/widget-model';
import { RenderWidgetService } from '../services/render-widget-service';

interface RenderPageTemplateArgs {
    templateFunction: NonNullable<TemplateRegistry[string]['templateFunction']>;
    widgets: WidgetModel[];
    orphanedControls: WidgetModel[];
    requestContext: RequestContext;
    traceContext?: unknown;
}

export function renderPageTemplate(args: RenderPageTemplateArgs): JSX.Element {
    const widgetsByPlaceholder: Record<string, WidgetModel[]> = {};
    const addWidget = (widget: WidgetModel, placeholder = widget.PlaceHolder) => {
        widgetsByPlaceholder[placeholder] ??= [];
        widgetsByPlaceholder[placeholder].push(widget);
    };

    args.widgets.forEach(widget => addWidget(widget));
    if (args.requestContext.isEdit) {
        args.orphanedControls.forEach(widget => {
            widget.Orphaned = true;
            addWidget(widget, 'Body');
        });
    }

    const renderedWidgets: Record<string, ReactNode[]> = Object.fromEntries(
        Object.keys(widgetsByPlaceholder).map(placeholder => [placeholder, []]));
    const accessedPlaceholders = new Set<string>();
    const renderedPlaceholders = new Set<string>();

    const renderPlaceholder = (placeholder: string): ReactNode[] => {
        renderedWidgets[placeholder] ??= [];
        if (!renderedPlaceholders.has(placeholder)) {
            widgetsByPlaceholder[placeholder]?.forEach(widget => {
                renderedWidgets[placeholder].push(
                    RenderWidgetService.createComponent(widget, args.requestContext, args.traceContext));
            });
            renderedPlaceholders.add(placeholder);
        }

        return renderedWidgets[placeholder];
    };

    const templateWidgets = new Proxy(renderedWidgets, {
        get: (target, property, receiver) => {
            if (typeof property !== 'string') {
                return Reflect.get(target, property, receiver);
            }

            accessedPlaceholders.add(property);
            return renderPlaceholder(property);
        }
    });

    const pageTemplate = args.templateFunction({ widgets: templateWidgets, requestContext: args.requestContext });
    const firstPlaceholder = accessedPlaceholders.values().next().value;
    if (args.requestContext.isEdit && firstPlaceholder) {
        Object.entries(widgetsByPlaceholder).forEach(([placeholder, widgets]) => {
            if (accessedPlaceholders.has(placeholder)) {
                return;
            }

            widgets.forEach(widget => {
                widget.Orphaned = true;
                renderedWidgets[firstPlaceholder].push(
                    RenderWidgetService.createComponent(widget, args.requestContext, args.traceContext));
            });
        });
    }

    return pageTemplate;
}
