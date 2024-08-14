import { SearchBoxViewProps } from './search-box.view-props';
import { SearchBoxEntity } from './search-box.entity';

export function serializeScoringProfile (scoringProfile: {scoringSetting: string, scoringParameters: string}) {
    let res = scoringProfile.scoringSetting;

    if (!!scoringProfile.scoringParameters) {
        res = `${res};${scoringProfile.scoringParameters}`;
    }

    return btoa(res);
};

export function getSearchBoxParams(searchModel: SearchBoxViewProps<SearchBoxEntity>, orderBy: string) {
    return {
        resultsUrl: searchModel.searchResultsPageUrl,
        catalogue: searchModel.searchIndex,
        scoringSetting: serializeScoringProfile(searchModel.scoringProfile),
        minSuggestionLength: searchModel.suggestionsTriggerCharCount,
        siteId: searchModel.siteId,
        culture: searchModel.culture,
        suggestionFields: searchModel.suggestionFields,
        servicePath: searchModel.webServicePath,
        orderBy,
        resultsForAllSites: searchModel.showResultsForAllIndexedSites
    };
};

export function getSearchUrl (query: string, searchModel: SearchBoxViewProps<SearchBoxEntity>, orderBy: string) {
    const searchParams = getSearchBoxParams(searchModel, orderBy);
    let resultsUrl = searchParams.resultsUrl || '';

    const queryParams: {[key: string]: string} = {
        indexCatalogue: searchParams.catalogue!,
        searchQuery: encodeURIComponent(query),
        wordsMode: 'AllWords',
        sf_culture: searchParams.culture
    };

    let separator = resultsUrl.indexOf('?') === -1 ? '?' : '&';

    let scoringSetting = searchParams.scoringSetting;
    if (scoringSetting) {
        queryParams['scoringInfo'] = scoringSetting;
    }

    if (searchParams.orderBy) {
        queryParams['$orderBy'] = searchParams.orderBy;
    }

    let resultsForAllSites = searchParams.resultsForAllSites;
    if (resultsForAllSites === 1) {
        queryParams['resultsForAllSites'] = 'True';
    } else if (resultsForAllSites === 2) {
        queryParams['resultsForAllSites'] = 'False';
    }

    return `${resultsUrl}${separator}${Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&')}`;
};
