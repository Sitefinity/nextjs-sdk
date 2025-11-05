export const invalidDataAttr = 'data-sf-invalid';

export const serializeForm = (form: HTMLFormElement) => {
    const obj: {
        [key: string]: string;
    } = {};
    const formData: any = new FormData(form);
    for (let key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
};

export const invalidateElement = (emptyInputs: any, element: HTMLInputElement) => {
    if (element) {
        emptyInputs[element.name] = true;
    }
};

export const isValidEmail = function (email: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(email);
};

export const formatDate = function (date: Date | string, culture?: string) {
    if (!date) {
        return '';
    }

    if (typeof(date) === 'string') {
        date = new Date(date);
    }
    const dateOptionsDay: Intl.DateTimeFormatOptions = { day: 'numeric' };
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', hour12: true, hour: '2-digit', minute: '2-digit' };

    return date.toLocaleString(culture, dateOptionsDay) + ' ' + date.toLocaleString(culture, dateOptions);
};

export const getWhiteListSearchParams = (
    searchParams:  {
        [key: string]: string;
    },
    whitelistedQueryParams: string[]) => {
    const filteredQueryCollection: { [key: string]: string } = {};
    whitelistedQueryParams.forEach(param => {
        const searchParamValue = (searchParams || {})[param];
        if (searchParamValue) {
            filteredQueryCollection[param] = searchParamValue;
        }
    });
    return filteredQueryCollection;
};


/**
 * Checks if a React component is a client component by examining the $$typeof property.
 * React uses the $$typeof property as a security measure and component type identifier.
 *
 * Possible values for $$typeof:
 * - Symbol.for('react.client.reference') - Client components (Next.js 13+ App Router)
 * - Symbol.for('react.server.reference') - Server components (Next.js 13+ App Router)
 */

export function isReactClientComponent(component: any): boolean {
    const typeOf = component?.$$typeof || {};
    return typeOf.toString().includes('react.client.reference');
}

export const SF_WEBSERVICE_API_KEY_HEADER = 'X-SF-APIKEY';
export const SF_WEBSERVICE_API_KEY = 'SF_WEBSERVICE_API_KEY';

