export interface SelectedFacetsState {
    [key: string]: {
        facetName: string,
        facetValue: string,
        facetDefaultValue: string,
        facetLabel: string,
        isCustom: boolean
    }
}
