'use client';

import { RequestContext } from '../../editor/request-context';
import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { EVENTS, PersonalizedWidgetsPayload, useSfEvents } from '../../pages/useSfEvents';
import { RenderWidgetService } from '../../services/render-widget-service';

export function RenderLazyForCSR(props: {id: string, requestContext: RequestContext}) {
    const [ models ] = useSfEvents<PersonalizedWidgetsPayload>(EVENTS.PERSONALIZED_WIDGETS_LOADED, true);

    return models && models[props.id] && !models[props.id].ssr && RenderWidgetService.createComponent(models[props.id].data as WidgetModel, props.requestContext);
}
