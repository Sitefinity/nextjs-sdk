import { ViewPropsBase } from '../common/view-props-base';
import { ResultsEntity } from './results.entity';

export interface FindResultItem {
    Title: string;
    Link?: string;
    Order: number;
}

export interface ResultsViewProps<T extends ResultsEntity> extends ViewPropsBase<T> {
    /** null means no search query was present — render nothing */
    searchResults: FindResultItem[] | null;
    resultsHeader: string;
    resultsNumberLabel: string;
    pageSize: number;
}
