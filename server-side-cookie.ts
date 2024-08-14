export async function getServerSideCookie(): Promise<string> {
    if (typeof window === 'undefined') {
        const headersModule = await import('next/headers');
        return headersModule.cookies().toString();
    }

    return '';
}
