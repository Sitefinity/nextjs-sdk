import { guid } from './guid';

/**
 * @hidden
 */
export const getUniqueId = (name?: string, uniqueId?: string): string =>{
    if (!name) {
        return guid();
    }

    const uniqueIdString = uniqueId || guid();

    return `${name}-${uniqueIdString}`;
};
