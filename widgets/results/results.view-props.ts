import { ViewPropsBase } from '../common/view-props-base';
import { ResultsEntity } from './results.entity';

export interface FindResultItem {
    Title: string;
    Link?: string;
    Order: number;
}

export interface ResultsViewProps<T extends ResultsEntity> extends ViewPropsBase<T> {
    cssClass: string | undefined;
    /** null means no search query was present — render nothing */
    searchResults: FindResultItem[] | null;
    resultsHeader: string;
    totalCount: number;
    resultsNumberLabel: string;
    pageSize: number;
}
