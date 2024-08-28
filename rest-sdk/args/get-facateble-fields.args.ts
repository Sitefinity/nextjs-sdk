import { Facet } from '../dto/facets/facet';
import { RequestArgs } from './request.args';

export interface GetFacatebleFieldsArgs extends RequestArgs {
    indexCatalogue: string
}
