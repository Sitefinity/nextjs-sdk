import { CombinedFilter } from '../filters/combined-filter';
import { FilterClause } from '../filters/filter-clause';
import { OrderBy } from '../filters/orderby';
import { RelationFilter } from '../filters/relation-filter';
import { GetCommonArgs } from './get-common.args';

export interface GetAllArgs extends GetCommonArgs {
    count?: boolean;
    orderBy?: OrderBy[],
    skip?: number;
    take?: number;
    filter?: FilterClause | CombinedFilter | RelationFilter | null;
}
