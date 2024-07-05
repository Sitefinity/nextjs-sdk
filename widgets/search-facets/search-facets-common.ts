import { Facet } from '../../rest-sdk/dto/facets/facet';
import { FacetFlatResponseDto } from '../../rest-sdk/dto/facets/facet-flat-dto';
import { FacetResponseDto } from '../../rest-sdk/dto/facets/facet-response-dto';
import { FacetsViewModelDto } from '../../rest-sdk/dto/facets/facets-viewmodel-dto';
import { RestClient } from '../../rest-sdk/rest-client';
import { WidgetSettingsFacetFieldMapper } from './facet-field-mapper';
import { FacetField } from './interfaces/facet-field';
import { SearchFacetsModelBuilder } from './search-facets-model-builder';
import { SearchFacetsViewModel } from './search-facets-viewmodel';

export async function getSearchFacets(searchQuery: string, culture: string, indexCatalogue: string, filter: string, resultsForAllSites: string, searchFields: any, facets: Facet[], ctx: any): Promise<{[k: string]: FacetResponseDto[]}> {
    let searchServiceFacetResponse: FacetFlatResponseDto[] = [];
    try {
        searchServiceFacetResponse = await RestClient.getFacets({
            searchQuery,
            culture,
            indexCatalogue,
            filter,
            resultsForAllSites,
            searchFields,
            facets,
            traceContext: ctx
        });
    } catch (_) {
        // noop
    }

    return  Object.fromEntries(
        searchServiceFacetResponse.map((p: FacetFlatResponseDto) => [p.FacetKey, p.FacetResponses])
    );
}

export function getSelectedFacetsToBeUsed(viewModel: SearchFacetsViewModel) {
    const selectedFacetsToBeUsed: FacetField[] = [];
    viewModel.SearchFacets.forEach((f) => {
       selectedFacetsToBeUsed.push(JSON.parse(JSON.stringify(f.facetField)));
   });

   return selectedFacetsToBeUsed;
}

export function getFacets(selectedFacetsToBeUsed: FacetField[], newSearchParams: { [key: string]: string }) {
    return WidgetSettingsFacetFieldMapper.mapWidgetSettingsToFieldsModel(selectedFacetsToBeUsed, newSearchParams['sf_culture']);
}

export async function updateFacetsViewModel(viewModel: SearchFacetsViewModel, newSearchParams: { [key: string]: string }, facetResponse: {[k: string]: FacetResponseDto[]}, selectedFacetsToBeUsed: FacetField[]) {
    const facetableFieldsFromIndex: FacetsViewModelDto[] = await RestClient.getFacatebleFields(newSearchParams.indexCatalogue);
    const facetableFieldsKeys: string[] = facetableFieldsFromIndex.map((x: FacetsViewModelDto) => x.FacetableFieldNames.length ? x.FacetableFieldNames[0]: '' );

    viewModel.SearchFacets = SearchFacetsModelBuilder.buildFacetsViewModel(selectedFacetsToBeUsed, facetResponse, facetableFieldsKeys, '');
}
