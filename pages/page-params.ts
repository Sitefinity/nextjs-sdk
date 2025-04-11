import { Dictionary } from '../typings/dictionary';

export type UrlParams = { slug: string[] };

export interface PageParams {
    params: UrlParams | Promise<UrlParams>,
    searchParams: Dictionary | Promise<Dictionary>,
    relatedFields?: string[],
    traceContext?: any
}
