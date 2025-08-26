import { CombinedFilter } from '../filters/combined-filter';
import { FilterClause } from '../filters/filter-clause';
import { OrderBy } from '../filters/orderby';
import { RelationFilter } from '../filters/relation-filter';
import { GetCommonArgs } from './get-common.args';

export interface GetAllArgs extends GetCommonArgs {
    /**
     * Whether to include the total count of items in the response.
     */
    count?: boolean;

    /**
     * Order expressions to sort the results.
     * Each expression should be in the format "fieldName asc|desc".
     */
    orderBy?: OrderBy[],

    /**
     * The number of items to skip before starting to collect the result set.
     */
    skip?: number;

    /**
     * The number of items to return.
     */
    take?: number;

    /**
     * Filter to apply to the results.
     */
    filter?: FilterClause | CombinedFilter | RelationFilter | null;
}
