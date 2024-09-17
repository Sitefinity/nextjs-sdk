export function getCheckboxId(facetName: string, facetValue: string) {
    return `facet-checkbox-${facetName}-${facetValue}`;
}

export function getFacetKeyFromCheckboxId(checkboxId: string) {
    return checkboxId.split('-')[2];
}

export const RANGE_SEPARATOR = '__sf-range__';
export const DATE_AND_TIME = 'DateAndTime';

export const computeFacetRangeValueForType = (fieldType: string, fromValue: string, toValue: string) => {
    if (fieldType === DATE_AND_TIME) {
        let fromdate = new Date(fromValue);
        fromdate.setHours(0);
        let toDate = new Date(toValue);
        toDate.setHours(0);

        return fromdate.toISOString() + RANGE_SEPARATOR + toDate.toISOString();
    }

    return fromValue + RANGE_SEPARATOR + toValue;
};

export const computeFacetRangeLabelForType = (fieldType: string, fromValue: string, toValue: string) => {
    if (fieldType === DATE_AND_TIME) {
        let fromDateTime = new Date(fromValue);
        let dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        let fromString = fromDateTime.toLocaleString(undefined, dateOptions) + ' ' + fromDateTime.getFullYear();

        let toDateTime = new Date(toValue);
        let toString = toDateTime.toLocaleString(undefined, dateOptions) + ' ' + toDateTime.getFullYear();

        return fromString + ' - ' + toString;
    }

    return fromValue + ' - ' + toValue;
};

export const formatDateValue = (date: string) => {
    if (date !== '') {
        let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }

    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
    }

    return date;
};

export const isEventCodeAllowed = (code: string) => {
    const conditions = ['Digit', 'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Numpad0','Numpad1','Numpad2','Numpad3','Numpad4','Numpad5','Numpad6','Numpad7','Numpad8','Numpad9'];
    return conditions.some(element => code.includes(element) || code === element);
};
