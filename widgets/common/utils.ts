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
