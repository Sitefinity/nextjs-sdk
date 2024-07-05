export const convertToBoolean = (input: string) => {
    switch (input.toLowerCase()) {
        case 'false':
        case 'no':
        case '0':
        case '': return false;
        default: return true;
    }
};
