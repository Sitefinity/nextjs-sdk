export function getProxyHeaders(host: string | null) {
    let resolvedHost =  process.env.PROXY_ORIGINAL_HOST || host;
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

    return headersCollection;
}
