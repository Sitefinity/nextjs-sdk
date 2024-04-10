import { Dictionary } from '../../typings/dictionary';

export interface GetPageLayoutArgs {
    pagePath: string,
    queryParams?: Dictionary;
    cookie?: string;
    additionalHeaders?: {[key: string]: string};
    followRedirects: boolean;
}
