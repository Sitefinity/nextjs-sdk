export interface SearchArgs {
    indexCatalogue: string;
    searchQuery: string;
    wordsMode: string;
    orderBy: string;
    culture: string,
    skip: number;
    take: number;
    searchFields: string;
    highlightedFields: string;
    scoringInfo: string;
    resultsForAllSites: boolean | null;
    filter: string;
    traceContext?: any;
    indexFields: string;
}
