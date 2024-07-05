'use client';

import { widgetRegistry } from '@widgetregistry';
import { ServiceMetadata, ServiceMetadataDefinition } from '../rest-sdk/service-metadata';
import { RenderWidgetService } from '../services/render-widget-service';
import { WidgetExecutionError } from '../widgets/error/widget-execution-error-component';
import { SdkItem } from '../rest-sdk/dto/sdk-item';
import { RestClient } from '../rest-sdk/rest-client';

export function PageFrontEndUtilLoader({ metadata, taxonomies, additionalQueryParams }: { metadata: ServiceMetadataDefinition, taxonomies: SdkItem[], additionalQueryParams: {[key: string]: string} }) {
    ServiceMetadata.serviceMetadataCache = metadata;
    ServiceMetadata.taxonomies = taxonomies;
    RestClient.contextQueryParams = additionalQueryParams;
    RenderWidgetService.widgetRegistry = widgetRegistry;
    RenderWidgetService.errorComponentType = WidgetExecutionError;

    return <></>;
}
