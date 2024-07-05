'use client';

export interface ExternalProviderData {
    cssClass: string,
    externalLoginPath: string,
    label: string
}

export class ExternalLoginBase {
    public static ErrorQueryKey = 'loginerror';
    public static ShowSuccessMessageQueryKey = 'showSuccessMessage';
    public static ExternalLoginHandlerPath?: string = '/sitefinity/external-login-handler';
    public static ShowSuccessMessageQueryParameter?: boolean = false;
    public static isError = (context: any) => {
        if (context && context.searchParams[this.ErrorQueryKey]) {
            return context.searchParams[this.ErrorQueryKey].toLowerCase() === 'true';
        }

        return false;
    };

    public static ShowSuccessMessage = (context: any) => {
        if (context && context.searchParams[this.ShowSuccessMessageQueryKey]) {
            return context.searchParams[this.ShowSuccessMessageQueryKey].toLowerCase() === 'true';
        }

        return false;
    };

    public static GetDefaultReturnUrl(context: any, args: {
        isError?: boolean,
        redirectUrl?: string,
        shouldEncode?: boolean
    } = { isError: false, shouldEncode: false}) {

        const searchParams = {
            ...context.searchParams
        };

        delete searchParams[this.ErrorQueryKey];
        delete searchParams[this.ShowSuccessMessageQueryKey];

        if (args.isError) {
            searchParams[this.ErrorQueryKey] = args.isError ? 'True' : 'False';
        } else if (this.ShowSuccessMessageQueryParameter) {
            searchParams[this.ShowSuccessMessageQueryKey] = 'True';
        }

        if (typeof window !== 'undefined') {
            const queryString = new URLSearchParams(searchParams);
            let result = '';
            if (args.redirectUrl) {
                result = args.redirectUrl;
            } else {
                result = window.location.href.replace(window.location.search, '');
            }

            if (queryString && Array.from(queryString).length > 0) {
                result = `${result}?${queryString}`;
            }

            if (!ExternalLoginBase.isAbsoluteUrl(result)) {
                result = new URL(result, window.location.origin).toString();
            }

            if (args.shouldEncode) {
                result = encodeURIComponent(result).toLowerCase();
            }

            return result;
        }

        if (args.redirectUrl) {
            return args.redirectUrl;
        }

        return '';
    }

    public static GetExternalLoginPath(context: any, provider: any, externalLoginHandlerPath?: string) {
        const expandPath = externalLoginHandlerPath || this.ExternalLoginHandlerPath;
        const returnUrl = this.GetDefaultReturnUrl(context, { isError: false, shouldEncode: true });
        const errorUrl = this.GetDefaultReturnUrl(context, { isError: true, shouldEncode: true });

        return `${expandPath}?provider=${provider}&returnUrl=${returnUrl}&errorUrl=${errorUrl}`;
    }

    public static GetExternalLoginButtonCssClass(provider: string) {
        if (!provider) {
            return '';
        }
        return '-sf-' + provider.toLowerCase() + '-button';
    }

    public static isAbsoluteUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }
}
