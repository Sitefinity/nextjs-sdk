import { cache } from 'react';

function serverContext<T>(defaultValue: T): [() => T, (v: T) => void] {
    if (cache) {
        const getRef = cache(() => ({ current: defaultValue }));

        const getValue = (): T => getRef().current;

        const setValue = (value: T) => {
            getRef().current = value;
        };

        return [getValue, setValue];
    }

    return [() => defaultValue, (v: T) => { }];
};

export const [getQueryParamsServerContext, setQueryParamsServerContext] = serverContext({});
export const [getHostServerContext, setHostServerContext] = serverContext('');
export const [getAdditionalFetchDataServerContext, setAdditionalFetchDataServerContext] = serverContext({});
