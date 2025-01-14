import { ReadonlyURLSearchParams } from 'next/navigation';

const FILTER_QUERY_PARAM = 'filter';

export function getQueryParams(currentQueryParams: ReadonlyURLSearchParams) {
    const queryParams: {[key: string]: any} = {};
    currentQueryParams?.forEach((v, k) => {
      queryParams[k] = v;
    });

    return queryParams;
}

export function setQueryParams(queryStringParams: { [key: string]: string; }) {
  const queryParams = Object.entries(queryStringParams)
  .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = key === FILTER_QUERY_PARAM ? value || '' : encodeURIComponent(value || '');
      return `${encodedKey}=${encodedValue}`;
  })
  .join('&');

  return queryParams;
}

