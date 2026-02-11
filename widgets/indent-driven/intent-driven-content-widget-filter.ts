'use client';
import { WidgetMetadata } from '../../editor/widget-framework/widget-metadata';
import { GetWidgetsArgs } from '../../editor/renderer-contract-interfaces';
import { ServiceMetadata } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

/**
 * Widget filter function for dynamic experience widgets.
 * @param widgetMetadata The metadata of the widget to filter.
 * @param args The arguments from the getWidgets call containing toolbox, category, search criteria.
 * @returns Promise<boolean> True if the widget should be included in the results, false otherwise.
 */
export async function filterDynamicExperienceWidgets(widgetMetadata: WidgetMetadata, args: GetWidgetsArgs): Promise<boolean> {
    if (widgetMetadata.designerMetadata?.Name === 'IntentBox' ||
        widgetMetadata.designerMetadata?.Name === 'IntentDrivenContent') {

        const isEnabled = ServiceMetadata.isModuleEnabled('dynamicExperience');
        return isEnabled;
    }

    return true;
}
