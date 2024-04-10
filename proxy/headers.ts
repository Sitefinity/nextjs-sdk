import { RootUrlService } from '../rest-sdk/root-url.service';

export function getProxyHeaders(host: string) {
    let resolvedHost =  host;
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
    if (!headersCollection['X-SF-WEBSERVICEPATH']) {
        headersCollection['X-SF-WEBSERVICEPATH'] = RootUrlService.getWebServicePath();
    }

    return headersCollection;
}
