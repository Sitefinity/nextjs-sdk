// these headers are present in the request and should be excluded to not be overwritten by the server headers
const HEADERS_TO_EXCLUDE = [
    'connection',
    'accept',
    'accept-encoding',
    'accept-language',
    'cookie',
    'host',
    'content-length'
];

export async function getFilteredServerSideHeaders(): Promise<{[key: string]: string}> {
    if (typeof window === 'undefined') {
        const headersModule = await import('next/headers');
        const headersList = await headersModule.headers();
        const requestHeaders = headersList ? Array.from(headersList) : [];

        const filteredHeaders = requestHeaders.filter(
            ([name]) => !HEADERS_TO_EXCLUDE.includes(name.toLowerCase())
        );

        return Object.fromEntries(filteredHeaders);
    }

    return {};
}
