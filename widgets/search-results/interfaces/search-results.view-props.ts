import { ViewPropsBase } from '../../common/view-props-base';
import { SearchResultsEntity } from '../search-results.entity';

export interface SearchResultsViewProps<T extends SearchResultsEntity> extends ViewPropsBase<T> {
    languagesLabel: string | null;
    resultsNumberLabel: string | null;
    cssClass: string | undefined;
    languages: {Name: string, Title: string}[];
    allowUsersToSortResults: boolean;
    sorting: string;
    sortByLabel: string | null;
    totalCount: number;
}
