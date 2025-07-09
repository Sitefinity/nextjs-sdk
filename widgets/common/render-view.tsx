import { ReactNode } from 'react';
import { RenderWidgetService } from '../../services/render-widget-service';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ViewPropsBase } from './view-props-base';
import { RenderViewClient } from './render-view-client';
import { isReactClientComponent } from './utils';

/**
 * If there is custom view it will be rendered. If there is not the children of this component will be rendered
 *
 * @param {string | undefined} viewName - Used to identify the custom view.
 * @param {string} widgetKey - Used in the widget registry as a property name.
 * @param {ReactNode} children - The children of the component. Used as a fallback if there is no custom view.
 * @param {any} viewProps - Props that are used for the view component.
 * @param {any} traceSpan Required param for the trace functionality.
 *
 * @returns {ReactNode} - The view for the widget.
 */
export function RenderView({viewName, widgetKey, children, viewProps, traceSpan}: RenderViewProps): ReactNode {
    let views = RenderWidgetService.widgetRegistry.widgets[widgetKey]?.views || {};

    // Fallback for deprecated 'templates' props. Remove this code once the prop is removed.
    if (RenderWidgetService.widgetRegistry.widgets[widgetKey]?.templates) {
        views = { ...views, ...RenderWidgetService.widgetRegistry.widgets[widgetKey]?.templates};
    }

    let widgetView = children;
    let renderClient = false;
    let widgetViewFunction = null;

    if (views && viewName && views[viewName]) {
        const view = views[viewName];
        if (typeof view === 'object' && view.ViewFunction) {
          widgetViewFunction = view.ViewFunction;
        } else {
          const viewFunction = views[viewName] as Function;
          widgetViewFunction = viewFunction;
        }

        if (isReactClientComponent(widgetViewFunction)) {
          renderClient = true;
        } else {
          widgetView = widgetViewFunction(viewProps);
        }
    }

    return (
      <>
        { !renderClient ?
          widgetView :
          <RenderViewClient {...{viewName, viewProps, widgetKey}}/>
        }
        {traceSpan && Tracer.endSpan(traceSpan)}
      </>
    );
}

interface RenderViewProps {
    viewName?: string;
    widgetKey: string;
    children: ReactNode;
    viewProps: ViewPropsBase;
    traceSpan?: any;
}
