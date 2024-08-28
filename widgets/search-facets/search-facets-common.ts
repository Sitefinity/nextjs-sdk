import { Facet } from '../../rest-sdk/dto/facets/facet';
import { FacetFlatResponseDto } from '../../rest-sdk/dto/facets/facet-flat-dto';
import { FacetResponseDto } from '../../rest-sdk/dto/facets/facet-response-dto';
import { FacetsViewModelDto } from '../../rest-sdk/dto/facets/facets-viewmodel-dto';
import { RestClient } from '../../rest-sdk/rest-client';
import { WidgetSettingsFacetFieldMapper } from './facet-field-mapper';
import { FacetField } from './interfaces/facet-field';
import { SearchFacetModel } from './search-facets-class';
import { SearchFacetsModelBuilder } from './search-facets-model-builder';
import { SearchFacetsViewProps } from './search-facets.view-props';
import { SearchFacetsEntity } from './search-facets.entity';

export async function getSearchFacets(searchQuery: string, culture: string, indexCatalogue: string, filter: string, resultsForAllSites: string, searchFields: any, facets: Facet[], ctx?: any): Promise<{[k: string]: FacetResponseDto[]}> {
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

export function getSelectedFacetsToBeUsed(searchFacets: SearchFacetModel[]) {
    const selectedFacetsToBeUsed: FacetField[] = [];
    searchFacets.forEach((f) => {
       selectedFacetsToBeUsed.push(JSON.parse(JSON.stringify(f.facetField)));
   });

   return selectedFacetsToBeUsed;
}

export function getFacets(selectedFacetsToBeUsed: FacetField[], newSearchParams: { [key: string]: string }) {
    return WidgetSettingsFacetFieldMapper.mapWidgetSettingsToFieldsModel(selectedFacetsToBeUsed, newSearchParams['sf_culture']);
}

export async function updateFacetsViewProps(newSearchParams: { [key: string]: string }, facetResponse: {[k: string]: FacetResponseDto[]}, selectedFacetsToBeUsed: FacetField[]) {
    const facetableFieldsFromIndex: FacetsViewModelDto[] = await RestClient.getFacatebleFields({ indexCatalogue: newSearchParams.indexCatalogue });
    const facetableFieldsKeys: string[] = facetableFieldsFromIndex.map((x: FacetsViewModelDto) => x.FacetableFieldNames.length ? x.FacetableFieldNames[0]: '' );
    const searchFacets = SearchFacetsModelBuilder.buildFacetsViewProps(selectedFacetsToBeUsed, facetResponse, facetableFieldsKeys, '');
    return {
        searchFacets,
        hasAnyFacetElements: SearchFacetsModelBuilder.hasAnyFacetElements(searchFacets)
    };
}

export async function getInitialFacetsWithModels(searchParams: {[key: string]: any}, entity: SearchFacetsEntity) {
    const searchQuery = searchParams['searchQuery'];
    const ret: {
        searchFacets: SearchFacetModel[],
        hasAnyFacetElements: boolean
    } = {
        searchFacets: [],
        hasAnyFacetElements: false
    };

    if (searchQuery && entity.IndexCatalogue) {
        const facetableFieldsFromIndex: FacetsViewModelDto[] = await RestClient.getFacatebleFields({ indexCatalogue: entity.IndexCatalogue });
        const facetableFieldsKeys: string[] = facetableFieldsFromIndex.map((x: FacetsViewModelDto) => x.FacetableFieldNames.length ? x.FacetableFieldNames[0]: '' );
        const sourceGroups: {[key: string]: FacetField[] } = entity.SelectedFacets!.reduce((group: {[key: string]: FacetField [] }, contentVariation: FacetField) => {
            const { FacetableFieldNames } = contentVariation;
                group[FacetableFieldNames[0]] = group[FacetableFieldNames[0]] ?? [];
                group[FacetableFieldNames[0]].push(contentVariation);
            return group;
        }, {});

        const selectedFacetsToBeUsed: FacetField[] = Object.values(sourceGroups)
            .map((e) => e[e.length - 1])
            .filter((x: FacetField) => facetableFieldsKeys.includes(x.FacetableFieldNames[0]));

        const facets: Facet[] = WidgetSettingsFacetFieldMapper.mapWidgetSettingsToFieldsModel(selectedFacetsToBeUsed, searchParams['sf_culture']);

        let facetsDict = await getSearchFacets(
            searchQuery,
            searchParams['sf_culture'],
            entity.IndexCatalogue,
            searchParams['filter'],
            searchParams['resultsForAllSites'],
            entity.SearchFields as string,
            facets);

        ret.searchFacets = SearchFacetsModelBuilder.buildFacetsViewProps(entity.SelectedFacets!, facetsDict, facetableFieldsKeys, entity.SortType || '');
    }

    ret.hasAnyFacetElements = SearchFacetsModelBuilder.hasAnyFacetElements(ret.searchFacets);

    return ret;
}
