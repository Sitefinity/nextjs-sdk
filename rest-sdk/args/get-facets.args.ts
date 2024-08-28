import { Facet } from '../dto/facets/facet';
import { RequestArgs } from './request.args';

export interface GetFacetsArgs extends RequestArgs {
    searchQuery: string,
    culture: string,
    indexCatalogue: string,
    filter: string,
    resultsForAllSites: string,
    searchFields: string,
    facets: Facet[],
}
