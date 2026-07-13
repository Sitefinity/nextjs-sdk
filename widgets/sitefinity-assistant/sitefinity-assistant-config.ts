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
                'CdnHostname is not configured in SitefinityAssistantConfig.'
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
        const serviceUlr = RootUrlService.getServerCmsServiceUrl(true);
        return assistantType === AssistantApiConstants.PARAG ?
                `${serviceUlr}/AgenticRag/` :
                `${serviceUlr}/SitefinityAssistantChatService/`;
    }
}
