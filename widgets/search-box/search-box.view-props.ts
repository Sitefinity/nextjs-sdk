import { ViewPropsBase } from '../common/view-props-base';
import { SearchBoxEntity } from './search-box.entity';

export interface SearchBoxViewProps<T extends SearchBoxEntity> extends ViewPropsBase<T> {
    suggestionsTriggerCharCount: number,
    searchButtonLabel: string | null,
    searchBoxPlaceholder: string | null,
    searchIndex: string | null;
    suggestionFields: string | null;
    webServicePath: string;
    searchResultsPageUrl: string | null;
    showResultsForAllIndexedSites: number;
    scoringProfile: {
        scoringSetting: string,
        scoringParameters: string
    },
    siteId: string;
    culture: string;
    activeClass: string;
    visibilityClassHidden: string;
    searchAutocompleteItemClass: string;
    isEdit: boolean;
}
