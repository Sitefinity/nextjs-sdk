'use client';
import { WidgetMetadata } from '../../editor/widget-framework/widget-metadata';
import { GetWidgetsArgs } from '../../editor/renderer-contract-interfaces';
import { RestClient, RootUrlService } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { AssistantApiConstants } from './assistant-api-constants';

/**
 * DTO for assistant module information from Sitefinity API
 */
interface SitefinityAssistantModuleInfoDto {
    /** Gets or sets the feature state of the assistant module */
    FeatureState: string;
}

/**
 * Widget filter function for SitefinityAssistant widget.
 * Filters the widget based on whether the AI assistant feature is enabled in Sitefinity.
 * @param widgetMetadata The metadata of the widget to filter.
 * @param args The arguments from the getWidgets call containing toolbox, category, search criteria.
 * @returns Promise<boolean> True if the widget should be included in the results, false otherwise.
 */
export async function filterSitefinityAssistantWidget(widgetMetadata: WidgetMetadata, args: GetWidgetsArgs): Promise<boolean> {
    // Only apply filtering logic to SitefinityAssistant widget
    if (widgetMetadata.designerMetadata?.Name !== 'SitefinityAssistant') {
        return true;
    }

    try {
        const moduleInfo = await readModuleInfoAsync();
        return moduleInfo?.FeatureState === 'enabled';
    } catch (error) {
        // Default to hiding the widget if we can't determine the feature state
        return false;
    }
}
    

/**
 * Reads the assistant module information from Sitefinity API.
 * @returns Promise with module info or null if API call fails.
 */
async function readModuleInfoAsync(): Promise<SitefinityAssistantModuleInfoDto | null> {
    try {
        let serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const functionUrl = `${serviceUrl}/${AssistantApiConstants.SitefinityAssistantModuleInfoEndpoint}`;
        const response = await RestClient.sendRequest<SitefinityAssistantModuleInfoDto>({
            url: functionUrl,
            method: 'GET'
        });

        return response;
    } catch (error) {
        return null;
    }
}
