import { SearchBoxViewModel } from './search-box-viewmodel';

export function serializeScoringProfile (scoringProfile: {ScoringSetting: string, ScoringParameters: string}) {
    let res = scoringProfile.ScoringSetting;

    if (!!scoringProfile.ScoringParameters) {
        res = `${res};${scoringProfile.ScoringParameters}`;
    }

    return btoa(res);
};

export function getSearchBoxParams (searchModel: SearchBoxViewModel) {
    return {
        resultsUrl: searchModel.SearchResultsPageUrl,
        catalogue: searchModel.SearchIndex,
        scoringSetting: serializeScoringProfile(searchModel.ScoringProfile),
        minSuggestionLength: searchModel.SuggestionsTriggerCharCount,
        siteId: searchModel.SiteId,
        culture: searchModel.Culture,
        suggestionFields: searchModel.SuggestionFields,
        servicePath: searchModel.WebServicePath,
        orderBy: searchModel.Sort,
        resultsForAllSites: searchModel.ShowResultsForAllIndexedSites
    };
};

export function getSearchUrl (query: string, searchModel: SearchBoxViewModel) {
    const searchParams = getSearchBoxParams(searchModel);
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
