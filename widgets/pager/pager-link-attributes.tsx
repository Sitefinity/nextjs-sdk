export function pagerLinkAttributes(href: string, navigateFunc?: Function) {
    // Private helper for URL validation
    function isUrlSafe(url: string): boolean {
        try {
            // Allow absolute relative URLs (starting with /)
            if (url.startsWith('/')) {
                return true;
            }

            // For absolute URLs, validate they have the same host
            if (url.includes('://')) {
                const urlObj = new URL(url);
                if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                    return false;
                }
                if (typeof window !== 'undefined' && urlObj.host !== window.location.host) {
                    return false;
                }
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    if (typeof window !== 'undefined' && navigateFunc) {
        return {
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                if (isUrlSafe(href)) {
                    navigateFunc(href);
                } else {
                    console.error('Navigation prevented to potentially unsafe URL:', href);
                }
            },
            href
        };
    }
    return {
        href
    };
}
