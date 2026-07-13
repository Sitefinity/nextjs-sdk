export class RootUrlService {
    public static getClientCmsUrl() {
        let publicUrl =`${process.env['NEXT_PUBLIC_SF_CMS_URL'] || ''}`;
        if (publicUrl.endsWith('/')) {
            publicUrl = publicUrl.substring(0, publicUrl.length - 1);
        }

        return publicUrl;
    }

    public static getServerCmsUrl() {
        let rootUrl: string = process.env['SF_CMS_URL'] as string;
        if (rootUrl && rootUrl.endsWith('/')) {
            rootUrl = rootUrl.substring(0, rootUrl.length - 1);
        }

        return rootUrl;
    }

    public static getServerCmsServiceUrl(proxy: boolean = false) {
        // Tests run in an environment where window is defined, so we need to add a clause to workaround it.
        return (typeof window === 'undefined' || process.env.NODE_ENV === 'test') && !proxy
            ? `${RootUrlService.getServerCmsUrl() || ''}/${RootUrlService.getWebServicePath()}`
            : `/sfrenderer/proxy/${RootUrlService.getWebServicePath()}`;
    }

    public static getWebServicePath() {
        let webServicePath = process?.env?.SF_WEBSERVICE_PATH;
        if (!webServicePath) {
            webServicePath = 'api/default';
        } else {
            // removes any leading and trailing slashes from the end of the string.
            webServicePath = webServicePath.replace(/^\/+|\/+$/g, '');
        }

        return webServicePath;
    }

    public static getSearchWebServicePath() {
        let searchWebServicePath = process.env.NEXT_PUBLIC_SF_SEARCH_WEBSERVICE_PATH;
        if (searchWebServicePath) {
            searchWebServicePath = searchWebServicePath.trim();

            // removes any trailing slashes from the end of the string.
            const trimmed = searchWebServicePath.replace(/\/+$/, '');
            return trimmed;
        }

        return this.getWebServicePath();
    }

    public static getSearchServiceUrl() {
        // Tests run in an environment where window is defined, so we need to add a clause to workaround it.
        return process.env.NODE_ENV === 'test'
            ? `${RootUrlService.getClientCmsUrl()}/${RootUrlService.getSearchWebServicePath()}`
            : `/sfrenderer/proxy/${RootUrlService.getSearchWebServicePath()}`;
    }
}
