'use client';

import { RenderWidgetService } from '../../services/render-widget-service';

export function RenderViewClient(props: {viewName: string | undefined, widgetKey: string, viewProps: any}) {
    if (!props.viewName) {
        return null;
    }

    const views = RenderWidgetService.widgetRegistry.widgets[props.widgetKey]?.views || {};
    const view = views[props.viewName];
    const viewFunction = typeof(view) === 'object' ? view.ViewFunction : view as Function;

    return viewFunction(props.viewProps);
}
