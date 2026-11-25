import { FacetElement } from './interfaces/facet-element';
import { FacetField } from './interfaces/facet-field';
import { SearchIndexAdditionalFieldType } from './interfaces/search-index-additional-field-type';

export interface SearchFacetModel {
    facetField?: FacetField;
    FacetElements: FacetElement[];
    FacetTitle: string;
    FacetFieldType: string;
    FacetFieldName: string;
    HasSearchResults?: boolean;
}

export class SearchFacetModelExtensions {
    static getModel(facetField: FacetField, facetElements: FacetElement[]): SearchFacetModel {
        return {
            facetField: facetField,
            FacetElements: facetElements || [],
            FacetTitle: facetField.FacetableFieldLabels,
            FacetFieldName: facetField.FacetableFieldNames[0],
            FacetFieldType: facetField.FacetFieldSettings!.FacetType!
        };
    }

    static ShowNumberCustomRange(facet: SearchFacetModel): boolean | undefined {
        return facet.HasSearchResults !== false &&
            facet.facetField!.FacetFieldSettings!.DisplayCustomRange &&
            (facet.FacetFieldType === SearchIndexAdditionalFieldType.NumberWhole ||
                facet.FacetFieldType === SearchIndexAdditionalFieldType.NumberDecimal);
    }

    static ShowDateCustomRanges(facet: SearchFacetModel): boolean | undefined {
        return facet.HasSearchResults !== false &&
            facet.facetField!.FacetFieldSettings!.RangeType === 1 &&
            facet.facetField!.FacetFieldSettings!.DisplayCustomRange &&
            facet.FacetFieldType === SearchIndexAdditionalFieldType.DateAndTime;
    }
}
