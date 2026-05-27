export interface SearchParams {
    searchQuery: string;
    indexCatalogue: string;
    wordsMode: string;
    ['sf_culture']: string;
    scoringInfo: string;
    resultsForAllSites: string;
    orderBy: string;
    filter: string;
    page: string;
    filterExpression: string  | null;
}
