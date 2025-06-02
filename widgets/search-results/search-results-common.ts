import { SearchResultsEntity } from './search-results.entity';
import { SearchParams } from './interfaces/search-params';
import { SearchResultsSorting } from './interfaces/search-results-sorting';
import { ContentListSettings } from './content-list-settings';
import { RestClient } from '../../rest-sdk/rest-client';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';

export async function performSearch(entity: SearchResultsEntity, searchParams: SearchParams, traceContext?: any) {
    if (searchParams.searchQuery) {
        let orderByClause = searchParams.orderBy || entity.Sorting;

        if (orderByClause === SearchResultsSorting.NewestFirst) {
            orderByClause = 'PublicationDate desc';
        } else if (orderByClause === SearchResultsSorting.OldestFirst) {
            orderByClause = 'PublicationDate';
        } else {
            orderByClause = '';
        }

        let skip = 0;
        let take = 20;

        let listSettings = entity.ListSettings as ContentListSettings;
        if (listSettings.DisplayMode === ListDisplayMode.Paging) {
            take = listSettings.ItemsPerPage;
            if (searchParams.page) {
                skip = (parseInt(searchParams.page, 10) - 1) * take;
            }
        } else if (listSettings.DisplayMode === ListDisplayMode.Limit) {
            take = listSettings.LimitItemsCount;
        }

        try {
          const searchResults = await RestClient.performSearch({
            indexCatalogue: searchParams.indexCatalogue,
            searchQuery: searchParams.searchQuery,
            wordsMode: searchParams.wordsMode,
            orderBy: orderByClause,
            culture: searchParams['sf_culture'],
            skip: skip,
            take: take,
            searchFields: entity.SearchFields as string,
            highlightedFields: entity.HighlightedFields as string,
            scoringInfo: searchParams.scoringInfo,
            resultsForAllSites: searchParams.resultsForAllSites === 'True',
            filter: searchParams.filter,
            indexFields: entity.AdditionalResultFields,
            traceContext
          });

            return searchResults;
        } catch (_) {
            return null;
        }
    }
}
