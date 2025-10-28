import { AssistantApiConstants } from './assistant-api-constants';
import { SitefinityAssistantConfig } from './sitefinity-assistant-config';

/**
 * DTO for version information from Sitefinity Assistant admin API
 */
export interface VersionInfoDto {
    productVersion: string;
}

/**
 * API client for making calls to Sitefinity Assistant services
 * Uses the NextJS RestClient infrastructure to properly handle OData API calls
 * This provides the same functionality as .NET Core SitefinityAssistantClient
 */
export class SitefinityAssistantApiClient {
    /**
     * Gets version information from Sitefinity Assistant admin API
     * Uses direct fetch since this is not an OData endpoint - calls your custom admin API
     * @returns Promise with version info or null if API call fails
     */
    static async getVersionInfoAsync(): Promise<VersionInfoDto | null> {
        try {
            const adminApiBaseUrl = SitefinityAssistantConfig.getAdminApiBaseUrl();
            const versionEndpoint = `${adminApiBaseUrl}${AssistantApiConstants.VersionInfoEndpoint}`;
            
            const response = await fetch(versionEndpoint);
            
            if (!response.ok) {
                return null;
            }
            
            const versionInfo: VersionInfoDto = await response.json();
            return versionInfo;
        } catch (error) {
            return null;
        }
    }
}
