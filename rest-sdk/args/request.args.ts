import { Dictionary } from '../../typings/dictionary';

export interface RequestArgs {
    /**
     * Additional headers that need to be added to the request.
     */
    additionalHeaders?: Dictionary;

    /**
     * Additional query parameters that need to be added to the request.
     */
    additionalQueryParams?: Dictionary;
    additionalFetchData?: any;
    traceContext?: any;
}
