import { Dictionary } from '../typings/dictionary';

export interface PageParams {
    params: {
        slug: string[]
    },
    searchParams: Dictionary,
    relatedFields?: string[],
    traceContext?: any
}
