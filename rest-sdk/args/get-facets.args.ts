import { Facet } from '../dto/facets/facet';

export interface GetFacetsArgs {
    searchQuery: string,
    culture: string,
    indexCatalogue: string,
    filter: string,
    resultsForAllSites: string,
    searchFields: string,
    facets: Facet[],
    traceContext?: any
}
