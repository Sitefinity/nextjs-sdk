import { Dictionary } from '../../typings/dictionary';

export interface GetPageLayoutArgs {
    pagePath: string,
    queryParams?: Dictionary;
    cookie?: string;
    relatedFields?: string[];
    additionalHeaders?: {[key: string]: string};
    followRedirects: boolean;
    traceContext?: any;
    additionalFetchData?: any;
}
