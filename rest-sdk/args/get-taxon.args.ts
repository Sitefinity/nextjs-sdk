export interface GetTaxonArgs {
    showEmpty: boolean;
    orderBy: string;
    taxaIds: string[];
    taxonomyId: string;
    selectionMode: string;
    contentType: string;
    traceContext?: any;
}
