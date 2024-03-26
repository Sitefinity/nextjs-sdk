'use client';

import { RendererContractImpl } from '../services/renderer-contract';
import { RenderWidgetService } from '../services/render-widget-service';
import { RequestContext } from '../editor/request-context';
import { ServiceMetadataDefinition, ServiceMetadata } from '../rest-sdk/service-metadata';
import { LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';
import { widgetRegistry } from '@widgetregistry';
import { SdkItem } from '../rest-sdk/dto/sdk-item';

export function RenderPageClient({ layout, metadata, taxonomies, context }: { layout: LayoutServiceResponse, metadata: ServiceMetadataDefinition, taxonomies: SdkItem[], context: RequestContext }) {
    RenderWidgetService.widgetRegistry = widgetRegistry;

    ServiceMetadata.serviceMetadataCache = metadata;
    ServiceMetadata.taxonomies = taxonomies;

    if (context.isEdit && typeof window !== 'undefined') {
        const timeout = 2000;
        const start = new Date().getTime();
        const handle = window.setInterval(() => {
            document.body.setAttribute('data-sfcontainer', 'Body');
            // we do not know the exact time when react has finished the rendering process.
            // thus we check every 100ms for dom changes. A proper check would be to see if every single
            // component is rendered
            const timePassed = new Date().getTime() - start;
            if ((layout.ComponentContext.Components.length > 0 && timePassed > timeout) || layout.ComponentContext.Components.length === 0) {
                window.clearInterval(handle);

                (window as any)['rendererContract'] = new RendererContractImpl();
                window.dispatchEvent(new Event('contractReady'));
            }
        }, 1000);
    }

    return <></>;
}

