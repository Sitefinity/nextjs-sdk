export function pagerLinkAttributes(href: string, navigateFunc?: Function) {
    if (typeof window !== 'undefined' && navigateFunc) {
        return {
            onClick: (e: any) => {
                e.preventDefault();
                navigateFunc(href);
            },
            href
        };
    }

    return {
        href
    };
}
