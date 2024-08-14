'use client';

import React from 'react';
import { getWhiteListSearchParams } from '../document-list/common/utils';
import { SearchParams } from './interfaces/search-params';

export function LanguagesList(props: {
    languages: {Name: string, Title: string}[],
    searchParams: SearchParams,
    queryParams: {[key: string]: any}
}) {
    const { languages, searchParams, queryParams } = props;
    const whitelistedQueryParams = ['sf_site', 'sfaction', 'sf_provider'];
    const queryList = new URLSearchParams(getWhiteListSearchParams(queryParams || {}, whitelistedQueryParams));
    const query = searchParams.searchQuery;
    const index = searchParams.indexCatalogue;
    const wordsMode = searchParams.wordsMode;
    const scoringInfo = searchParams.scoringInfo;
    const resultsForAllSites = searchParams.resultsForAllSites;
    const orderBy = searchParams.orderBy;
    const filter = searchParams.filter;

    const changeSearchLanguage = (culture: string) => {
        const separator = !!queryList ? '?' : '&';
        let newQuery = queryList + separator + 'searchQuery=' + query +
            '&indexCatalogue=' + index +
            '&wordsMode=' + wordsMode +
            '&sf_culture=' + culture;

        if (orderBy) {
            newQuery = newQuery + '&orderBy=' + orderBy;
        }

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

   return languages.map((language: {Name: string, Title: string}, idx: number) => {
        return (<span key={idx}>
          <a className="text-decoration-none" data-sf-role="search-results-language"
            data-sf-language={language.Name} onClick={() => changeSearchLanguage(language.Name)}
            href="#">
            {language.Title}
          </a>
          {idx + 1 < languages.length ? ', ' : null}
        </span>);
    });
}
