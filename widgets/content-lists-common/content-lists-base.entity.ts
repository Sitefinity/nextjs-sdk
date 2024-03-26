import { ContentListSettings } from '../../editor/widget-framework/content-list-settings';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { CombinedFilter } from '../../rest-sdk/filters/combined-filter';
import { FilterClause } from '../../rest-sdk/filters/filter-clause';
import { RelationFilter } from '../../rest-sdk/filters/relation-filter';
import { PagerMode } from '../common/page-mode';
import { DetailPageSelectionMode } from './detail-page-selection-mode';


export interface ContentListEntityBase {
    SelectedItems: MixedContentContext | null;
    ListSettings: ContentListSettings | null;
    FilterExpression: CombinedFilter | FilterClause | RelationFilter | null;
    SelectionGroupLogicalOperator: 'AND' | 'OR';
    OrderBy: string;
    SortExpression: string;
    SelectExpression?: string;
    PagerTemplate: string;
    PagerQueryTemplate: string;
    PagerMode: PagerMode;
    DetailPage: MixedContentContext | null;
    DetailPageMode: DetailPageSelectionMode;
}
