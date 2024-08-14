import { ViewPropsBase } from '../common/view-props-base';
import { SearchFacetsEntity } from './search-facets.entity';

export interface SearchFacetsViewProps<T extends SearchFacetsEntity> extends ViewPropsBase<T> {
    indexCatalogue: string | null;
    appliedFiltersLabel: string | null;
    clearAllLabel: string | null;
    filterResultsLabel: string | null;
    showMoreLabel: string | null;
    showLessLabel: string | null;
    isShowMoreLessButtonActive: boolean;
    displayItemCount: boolean;
    isEdit: boolean;
}
