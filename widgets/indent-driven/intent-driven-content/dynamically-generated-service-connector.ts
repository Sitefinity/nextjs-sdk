import { RootUrlService } from '../../../rest-sdk';

export interface CurrentUserJourney {
    contentId: string;
    contentType: string;
    language?: string;
    timestamp: string;
}

export interface RequestParams {
    sections: string[];
    query?: string;
    siteId?: string;
    language?: string;
    pageId?: string;
    isUserQuery?: boolean;
    variationId?: string;
    userJourneyData?: {
        currentUserJourney: CurrentUserJourney[],
        subjectKey: string,
        source: string
    }
}

export interface SectionPayload {
    sectionData: any,
    sectionName: string,
    sectionType: string
}

export type ErrorType = 'ServiceError' | 'QuotaExceeded' | 'NoContent'; 

export interface ErrorPayload {
    errorMessage?: string;
    errorType: ErrorType;
}

const ERROR_MESSAGES = {
    SERVICE_UNAVAILABLE: 'Service unavailable',
    TOO_MANY_REQUESTS: 'Too many requests',
    PAYMENT_REQUIRED: 'Payment required'
};

const DEFAULT_ERROR_CONFIG = {
    message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    errorType: 'ServiceError'
};

const ERROR_STATUS_MAP: Record<number, { message: string; allowErrorSurfacing?: boolean, errorType: ErrorType }> = {
    429: {
        message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
        allowErrorSurfacing: false, // explicitly set, but false by default
        errorType: 'QuotaExceeded'
    },
    402: {
        message: ERROR_MESSAGES.PAYMENT_REQUIRED,
        allowErrorSurfacing: false,
        errorType: 'QuotaExceeded'
    }
};

function normalizeErrorResponse(status: number, responseText: string): ErrorPayload {
    let responseData: any = null;
    if (responseText) {
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            responseData = null;
        }
    }

    const statusConfig = ERROR_STATUS_MAP[status] || DEFAULT_ERROR_CONFIG;
    const errorData: ErrorPayload = {
        errorMessage: statusConfig.message,
        errorType: statusConfig.errorType
    };

    if (statusConfig.allowErrorSurfacing) {
        if (responseData?.errorMessage) {
            errorData.errorMessage = responseData.errorMessage;
        } else if (responseData?.message) {
            errorData.errorMessage = responseData.message;
        } else if (responseText) {
            errorData.errorMessage = responseText;
        }
    }

    return errorData;
}

export class DGEServiceConnector {    
    static async fetchDataStream(params: RequestParams,
        onData?: (data: SectionPayload) => void,
        onError?: (error: ErrorPayload) => void,
        onComplete?: (collectedData: SectionPayload[]) => void
    ): Promise<void> {
        const serviceUrl = RootUrlService.getWebServicePath();
        const apiUrl = `/${serviceUrl}/DynamicExperience/content`;
        const url = !params.variationId ? apiUrl : `${apiUrl}?variationId=${params.variationId}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        if (!response.ok) {
            let responseText = '';
            try {
                responseText = await response.text();
            } catch (e) {
                responseText = '';
            }

            onError?.(normalizeErrorResponse(response.status, responseText));
            return;
        }

        if (!response.body) {
            onError?.({
                errorMessage: DEFAULT_ERROR_CONFIG.message,
                errorType: DEFAULT_ERROR_CONFIG.errorType as ErrorType
            });
            return;
        }

        // Get a reader from the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let parsingStreamingCollection = false;
        let collectedData = '';

        // Read the stream
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            // Convert the Uint8Array to a string
            const chunk = decoder.decode(value, { stream: true });

            collectedData += chunk;

            try {
                // For streaming enumerable collection
                let trimmedChunk = chunk.trim();
                if (parsingStreamingCollection || trimmedChunk.startsWith('[')) {
                    if (trimmedChunk.startsWith('[') && trimmedChunk.endsWith(']')) {
                        // Single complete array in one chunk
                        const parsedData = JSON.parse(trimmedChunk);
                        parsedData.forEach((item: any) => onData?.(item));
                        continue;
                    }
                    parsingStreamingCollection = true;

                    if (trimmedChunk.startsWith('[')) {
                        trimmedChunk = trimmedChunk.substring(1).trim(); // Remove starting '['
                    }

                    if (trimmedChunk.startsWith(',')) {
                        trimmedChunk = trimmedChunk.substring(1).trim(); // Remove starting ','
                    } 

                    if (trimmedChunk.endsWith(']')) {
                        trimmedChunk = trimmedChunk.substring(0, trimmedChunk.length - 1).trim(); // Remove ending ']'
                        parsingStreamingCollection = false;
                    }

                    if (trimmedChunk) {
                        const parsedData = JSON.parse(trimmedChunk);
                        onData?.(parsedData);
                        continue;
                    }
                }

                // Check if the chunk contains multiple JSON objects
                // (For APIs that send multiple JSON objects separated by newlines)
                if (chunk.includes('\n')) {
                    const jsonObjects = chunk.trim().split('\n');
                    for (const jsonStr of jsonObjects) {
                        if (jsonStr.trim()) {
                            const parsedData = JSON.parse(jsonStr);
                            onData?.(parsedData);
                            continue;
                        }
                    }
                } else {
                    // For a single JSON object in the chunk
                    const parsedData = JSON.parse(chunk);
                    onData?.(parsedData);
                    continue;
                }
            } catch (error) {
                console.error('Error parsing JSON chunk:', error);
            }
        }

        let parsedCollectedData = [];

        try {
            parsedCollectedData = JSON.parse(collectedData);
        } catch (error) {
            console.error('Error parsing collected JSON data:', error);
            // Show an error in the UI if the complete collected data fails to parse.
            onError?.({
                errorMessage: DEFAULT_ERROR_CONFIG.message,
                errorType: DEFAULT_ERROR_CONFIG.errorType as ErrorType
            });
            return;
        }

        onComplete?.(parsedCollectedData);

        return;
    }
}
