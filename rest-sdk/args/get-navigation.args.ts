import { RequestArgs } from './request.args';

export interface GetNavigationArgs extends RequestArgs {
    selectionMode?: string;
    showParentPage?: boolean;
    currentPage?: string;
    selectedPages?: string[];
    levelsToInclude?: number;
    selectedPageId?: string;
    culture?: string;
}
