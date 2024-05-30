'use client';

import { widgetRegistry } from '@widgetregistry';
import { ServiceMetadata, ServiceMetadataDefinition } from '../rest-sdk/service-metadata';
import { RenderWidgetService } from '../services/render-widget-service';
import { WidgetExecutionError } from '../widgets/error/widget-execution-error-component';
import { SdkItem } from '../rest-sdk/dto/sdk-item';

export function PageFrontEndUtilLoader({ metadata, taxonomies }: { metadata: ServiceMetadataDefinition, taxonomies: SdkItem[] }) {
    ServiceMetadata.serviceMetadataCache = metadata;
    ServiceMetadata.taxonomies = taxonomies;
    RenderWidgetService.widgetRegistry = widgetRegistry;
    RenderWidgetService.errorComponentType = WidgetExecutionError;

    return <></>;
}
