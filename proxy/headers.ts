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
    if (process.env.SF_CLOUD_KEY) {
        // for Sitefinity cloud
        headersCollection['X-SF-BYPASS-HOST'] = resolvedHost;

        headersCollection['X-SF-BYPASS-HOST-VALIDATION-KEY'] = process.env.SF_CLOUD_KEY;
    } else {
        headersCollection['X-ORIGINAL-HOST'] = resolvedHost;
    }

    headersCollection['X-SFRENDERER-PROXY'] = 'true';
    headersCollection['X-SFRENDERER-PROXY-NAME'] = RENDERER_NAME;
    if (!headersCollection['X-SF-WEBSERVICEPATH']) {
        headersCollection['X-SF-WEBSERVICEPATH'] = RootUrlService.getWebServicePath();
    }

    return headersCollection;
}
