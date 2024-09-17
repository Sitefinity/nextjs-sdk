import { ReadonlyURLSearchParams } from 'next/navigation';

export function getQueryParams(currentQueryParams: ReadonlyURLSearchParams) {
    const queryParams: {[key: string]: any} = {};
    currentQueryParams?.forEach((v, k) => {
      queryParams[k] = v;
    });

    return queryParams;
}
