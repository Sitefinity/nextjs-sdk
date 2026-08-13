import { createElement, Fragment, JSX, ReactNode } from 'react';

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

export interface RenderPageTemplateResult {
    pageTemplate: JSX.Element;
    hasOrphanedControls: boolean;
}

export function renderPageTemplate(args: RenderPageTemplateArgs): RenderPageTemplateResult {
    const widgetsByPlaceholder: Record<string, WidgetModel[]> = {};
    const addWidget = (widget: WidgetModel, placeholder = widget.PlaceHolder) => {
        widgetsByPlaceholder[placeholder] ??= [];
        widgetsByPlaceholder[placeholder].push(widget);
    };

    args.widgets.forEach(widget => addWidget(widget));

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
    if (!args.requestContext.isEdit) {
        return { pageTemplate, hasOrphanedControls: false };
    }

    const unclaimedWidgets = Object.entries(widgetsByPlaceholder)
        .filter(([placeholder]) => !accessedPlaceholders.has(placeholder))
        .flatMap(([, widgets]) => widgets);

    const orphanedWidgets = [...args.orphanedControls, ...unclaimedWidgets];
    const orphanedComponents = orphanedWidgets.map(widget => {
        const orphanedWidget = { ...widget, Orphaned: true };
        return RenderWidgetService.createComponent(orphanedWidget, args.requestContext, args.traceContext);
    });

    if (orphanedComponents.length === 0) {
        return { pageTemplate, hasOrphanedControls: false };
    }

    return {
        pageTemplate: createElement(Fragment, null, pageTemplate, ...orphanedComponents),
        hasOrphanedControls: true
    };
}
