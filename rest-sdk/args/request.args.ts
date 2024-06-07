import { Dictionary } from '../../typings/dictionary';

export interface RequestArgs {
    additionalHeaders?: Dictionary;
    additionalQueryParams?: Dictionary;
    additionalFetchData?: any;
    traceContext?: any;
}
