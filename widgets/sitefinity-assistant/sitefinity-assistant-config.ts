import { RootUrlService } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { AssistantApiConstants } from './assistant-api-constants';

/**
 * Configuration service for Sitefinity Assistant widget
 * Provides access to environment variables and configuration settings
 */
export class SitefinityAssistantConfig {
    /**
     * Gets the CDN hostname for Sitefinity Assistant resources
     * @throws Error if SF_ASSISTANT_CDN_HOSTNAME environment variable is not configured
     */
    static getCdnHostname(): string {
        const hostname = process.env.SF_ASSISTANT_CDN_HOSTNAME;
        if (!hostname) {
            throw new Error(
                'SF_ASSISTANT_CDN_HOSTNAME environment variable is not configured. ' +
                'Please set this to your CDN hostname for Sitefinity Assistant resources.'
            );
        }
        return hostname;
    }

    /**
     * Generates a full CDN URL for a given filename
     * @param filename The filename to generate URL for
     * @param version Optional version parameter
     * @throws Error if SF_ASSISTANT_CDN_HOSTNAME is not configured
     */
    static getCdnUrl(filename: string, version?: string): string {
        const hostname = this.getCdnHostname();
        const baseUrl = hostname.startsWith('http')
            ? hostname
            : `https://${hostname}`;

        const versionSuffix = version ? `?ver=${version}` : '';

        return `${baseUrl}/${filename}${versionSuffix}`;
    }

    /**
     * Gets the chat service endpoint URL
     */
    static getChatServiceUrl(assistantType: string | null): string {
        const webServicePath = RootUrlService.getWebServicePath();
        return assistantType === AssistantApiConstants.PARAG ?
                `/${webServicePath}/AgenticRag/` :
                `/${webServicePath}/SitefinityAssistantChatService/`;
    }
}
