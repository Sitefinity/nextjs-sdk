import { RequestArgs } from './request.args';

export interface GetTaxonArgs extends RequestArgs {
    showEmpty: boolean;
    orderBy: string;
    taxaIds: string[];
    taxonomyId: string;
    selectionMode: string;
    contentType: string;
}
