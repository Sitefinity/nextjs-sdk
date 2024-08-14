import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RenderWidgetService } from '../../services/render-widget-service';
import { RenderLazyForCSR } from './lazy-component-for-csr';
import { RenderLazyForSSR } from './lazy-component-for-ssr';

export async function LazyComponent(props: WidgetContext<any>) {
    const widgetName = props.model.Name;
    const widgetEntry = RenderWidgetService.widgetRegistry.widgets[widgetName];

    if (widgetEntry && !widgetEntry.ssr) {
        return <RenderLazyForCSR id={props.model.Id} requestContext={props.requestContext} />;
    }
    return (
      <RenderLazyForSSR id={props.model.Id} requestContext={props.requestContext} />
    );
}

