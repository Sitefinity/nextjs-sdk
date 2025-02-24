'use client';

import React from 'react';
import { SearchResultsSorting } from './interfaces/search-results-sorting';
import { SearchParams } from './interfaces/search-params';
import { getWhiteListSearchParams } from '../common/utils';

export function OrderByDropDown(props: {
    sortingSelectId: string;
    searchParams: SearchParams,
    queryParams: {[key: string]: any},
    sorting: string;
}) {
    const { sortingSelectId, searchParams, sorting, queryParams } = props;
    const whitelistedQueryParams = ['sf_site', 'sfaction', 'sf_provider'];
    const queryList = new URLSearchParams(getWhiteListSearchParams(queryParams || {}, whitelistedQueryParams));
    const query = searchParams['searchQuery'];
    const index = searchParams['indexCatalogue'];
    const wordsMode = searchParams['wordsMode'];
    const language = searchParams['sf_culture'];
    const scoringInfo = searchParams['scoringInfo'];
    const resultsForAllSites = searchParams['resultsForAllSites'];
    const orderBy = sorting;
    const filter = searchParams['filter'];

    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const orderValue = event.target.value || orderBy;
        let newQuery = queryList + '&searchQuery=' + encodeURIComponent(query) +
            '&indexCatalogue=' + index +
            '&wordsMode=' + wordsMode +
            '&sf_culture=' + language +
            '&orderBy=' + orderValue;

        if (scoringInfo) {
            newQuery = newQuery + '&scoringInfo=' + scoringInfo;
        }

        if (filter) {
            newQuery = newQuery + '&filter=' + filter;
        }

        if (resultsForAllSites === 'True') {
            newQuery += '&resultsForAllSites=True';
        } else if (resultsForAllSites === 'False') {
            newQuery += '&resultsForAllSites=False';
        }

        window.location.search = newQuery;
    };

    return (
      <select onChange={handleSelectionChange} className="userSortDropdown form-select" value={orderBy}
        title="SortDropdown" id={sortingSelectId}>
        <option value={SearchResultsSorting.MostRelevantOnTop}>Relevance</option>
        <option value={SearchResultsSorting.NewestFirst}>Newest first</option>
        <option value={SearchResultsSorting.OldestFirst}>Oldest first</option>
      </select>
    );
}

