'use client';
import { WidgetMetadata } from '../../editor/widget-framework/widget-metadata';
import { GetWidgetsArgs } from '../../editor/renderer-contract-interfaces';
import { ServiceMetadata } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

/**
 * Widget filter function for SitefinityAssistant widget.
 * Filters the widget based on CDN configuration and whether the AI assistant module is enabled in Sitefinity.
 * @param widgetMetadata The metadata of the widget to filter.
 * @param args The arguments from the getWidgets call containing toolbox, category, search criteria.
 * @returns Promise<boolean> True if the widget should be included in the results, false otherwise.
 */
export async function filterSitefinityAssistantWidget(widgetMetadata: WidgetMetadata, args: GetWidgetsArgs): Promise<boolean> {
    // Only apply filtering logic to SitefinityAssistant widget
    if (widgetMetadata.designerMetadata?.Name !== 'SitefinityAssistant') {
        return true;
    }

    const isEnabled = ServiceMetadata.isModuleEnabled('sitefinityAssistant');
    return isEnabled;
}
