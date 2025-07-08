import { RootUrlService } from '../rest-sdk/root-url.service';
export const RENDERER_NAME = 'NextJS';

export function getProxyHeaders(host: string) {
    let resolvedHost = process.env.SF_PROXY_ORIGINAL_HOST || host;
    if (!resolvedHost) {
        if (process.env.PORT) {
            resolvedHost = `localhost:${process.env.PORT}`;
        } else {
            resolvedHost = 'localhost';
        }
    }

    let headersCollection: { [key: string]: string }  = {};
    if (process.env.SF_LOCAL_VALIDATION_KEY) {
        // for Sitefinity cloud
        headersCollection['X-SF-BYPASS-HOST'] = resolvedHost;
        headersCollection['X-SF-BYPASS-HOST-VALIDATION-KEY'] = process.env.SF_LOCAL_VALIDATION_KEY;
    } else {
        headersCollection['X-ORIGINAL-HOST'] = resolvedHost;
    }

    headersCollection['X-SFRENDERER-PROXY'] = 'true';
    headersCollection['X-SFRENDERER-PROXY-NAME'] = RENDERER_NAME;
    if (!headersCollection['X-SF-WEBSERVICEPATH']) {
        headersCollection['X-SF-WEBSERVICEPATH'] = RootUrlService.getWebServicePath();
    }

    if (!headersCollection['x-sf-correlation-id']) {
        headersCollection['x-sf-correlation-id'] = generateRandomString();
    }

    return headersCollection;
}

function generateRandomString() {
    let result = '';
    let length = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

