import { StyleGenerator } from '../styling/style-generator.service';
import { FacetField } from './interfaces/facet-field';
import { FacetsViewModelDto } from '../../rest-sdk/dto/facets/facets-viewmodel-dto';
import { Facet } from '../../rest-sdk/dto/facets/facet';
import { WidgetSettingsFacetFieldMapper } from './facet-field-mapper';
import { FacetFlatResponseDto } from '../../rest-sdk/dto/facets/facet-flat-dto';
import { SearchFacetsModelBuilder } from './search-facets-model-builder';
import { SearchFacetsClient } from './search-facets-model';
import { SearchFacetsEntity } from './search-facets.entity';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestClient } from '../../rest-sdk/rest-client';
import { SearchFacetsViewModel } from './search-facets-viewmodel';

export async function SearchFacets(props: WidgetContext<SearchFacetsEntity>) {
    const model = props.model;
    const dataAttributes = htmlAttributes(props);
    const entity = model.Properties;

    const context = props.requestContext;
    const searchParams = context.searchParams || {};
    const viewModel: SearchFacetsViewModel = {
        IndexCatalogue: entity.IndexCatalogue,
        Attributes: entity.Attributes,
        AppliedFiltersLabel: entity.AppliedFiltersLabel,
        ClearAllLabel: entity.ClearAllLabel,
        FilterResultsLabel: entity.FilterResultsLabel,
        ShowMoreLabel: entity.ShowMoreLabel,
        ShowLessLabel: entity.ShowLessLabel,
        IsShowMoreLessButtonActive: entity.IsShowMoreLessButtonActive,
        DisplayItemCount: entity.DisplayItemCount,
        HasAnyFacetElements: false,
        SearchFacets: []
    };

    const searchQuery = searchParams['searchQuery'];

    if (searchQuery && entity.IndexCatalogue) {
        const facetableFieldsFromIndex: FacetsViewModelDto[] = await RestClient.getFacatebleFields(entity.IndexCatalogue);
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

        const facets: Facet[] = WidgetSettingsFacetFieldMapper.mapWidgetSettingsToFieldsModel(selectedFacetsToBeUsed);
        const filter = searchParams['filter'];
        const culture = searchParams['sf_culture'];
        const resultsForAllSites = searchParams['resultsForAllSites'];
        let searchServiceFacetResponse = await RestClient.getFacets({ searchQuery, culture, indexCatalogue: entity.IndexCatalogue, filter, resultsForAllSites, searchFields: entity.SearchFields as string, facets });

        const facetsDict = Object.fromEntries(
            searchServiceFacetResponse.map((p: FacetFlatResponseDto) => [p.FacetKey, p.FacetResponses])
        );

        viewModel.SearchFacets = SearchFacetsModelBuilder.buildFacetsViewModel(entity.SelectedFacets!, facetsDict, facetableFieldsKeys, entity.SortType || '');
    }

    viewModel.HasAnyFacetElements = SearchFacetsModelBuilder.hasAnyFacetElements(viewModel.SearchFacets);

    const defaultClass =  entity.WidgetCssClass;
    const marginClass = entity.Margins! && StyleGenerator.getMarginClasses(entity.Margins!);
    const searchFacetsCustomAttributes = getCustomAttributes(entity.Attributes, 'SearchFacets');

    dataAttributes['className'] = classNames(
        defaultClass,
        marginClass
    );

    return (
      <>
        <div
          {...dataAttributes}
          {...searchFacetsCustomAttributes}
        >
          <SearchFacetsClient viewModel={viewModel} searchParams={searchParams} />
        </div>
        <input type="hidden" id="sf-currentPageUrl" value="@(this.Context?.Request.Path ?? string.Empty)" />
      </>
    );
}
