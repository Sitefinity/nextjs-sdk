'use client';

import { ServiceMetadata, ServiceMetadataDefinition } from '../rest-sdk/service-metadata';
import { RenderWidgetService } from '../services/render-widget-service';
import { SdkItem } from '../rest-sdk/dto/sdk-item';
import { RestClient } from '../rest-sdk/rest-client';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';

export function PageFrontEndUtilLoader({ metadata, taxonomies, additionalQueryParams, registry }:
    { metadata: ServiceMetadataDefinition, taxonomies: SdkItem[], additionalQueryParams: {[key: string]: string}, registry: WidgetRegistry }) {
    ServiceMetadata.serviceMetadataCache = metadata;
    ServiceMetadata.taxonomies = taxonomies;
    RestClient.contextQueryParams = additionalQueryParams;
    RenderWidgetService.widgetRegistry = registry;

    return <></>;
}
