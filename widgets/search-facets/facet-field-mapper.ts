import { Facet } from '../../rest-sdk/dto/facets/facet';
import { FacetField } from './interfaces/facet-field';
import { SearchIndexAdditionalFieldType } from './interfaces/search-index-additional-field-type';
import { SearchFacetExtensions } from './search-facets-extensions';
import { CustomFacetRange } from '../../rest-sdk/dto/facets/custom-facet-range';
import { FacetSettings } from './interfaces/facet-settings';
import { DateRange } from './interfaces/date-range';
import { SitefinityFacetType } from '../../rest-sdk/dto/sitefinity-facet-type';
import { NumberRange } from './interfaces/number-range';

export class WidgetSettingsFacetFieldMapper {

    static getIntervalDateTime(dateStep: string) {
        if (dateStep) {
            switch (dateStep.toString()) {
                case '0':
                    return 'day';
                case '1':
                    return 'week';
                case '2':
                    return 'month';
                case '3':
                    return 'quarter';
                case '4':
                    return 'year';
                default:
                    return 'day';
            }
        }

        // UX: if there is no step specified we fallback to a day interval.
        return 'day';
    }

    static mapWidgetSettingsToFieldsModel(selectedFacetsToBeUsed: FacetField[], culture: string) {
        const facetFields: Facet[] = [];
        selectedFacetsToBeUsed.forEach((facet: FacetField)=> {
            let facetFieldName = facet.FacetableFieldNames.length ? facet.FacetableFieldNames[0] : '';

            let settings = facet.FacetFieldSettings!;

            // eslint-disable-next-line eqeqeq
            if (facet.FacetFieldSettings!.RangeType == SearchFacetExtensions.AutoGeneratedFacet) {
                if (SearchFacetExtensions.isValueFacet(settings)) {
                    facetFields.push(this.createValueFacetFieldModel(facetFieldName, settings));
                } else if (settings.FacetType === SearchIndexAdditionalFieldType.NumberWhole || settings.FacetType === SearchIndexAdditionalFieldType.NumberDecimal) {
                    facetFields.push(this.createNumberIntervalFacetFieldModel(facetFieldName, settings));
                } else if (settings.FacetType === SearchIndexAdditionalFieldType.DateAndTime) {
                    facetFields.push(this.createDateIntervalFacetFieldModel(facetFieldName, settings));
                }
            } else {
                if (settings.FacetType === SearchIndexAdditionalFieldType.NumberWhole || settings.FacetType === SearchIndexAdditionalFieldType.NumberDecimal) {
                    facetFields.push(this.createNumberRangeFacetFieldModel(facetFieldName, settings, culture));
                } else if (settings.FacetType === SearchIndexAdditionalFieldType.DateAndTime) {
                    facetFields.push(this.createDateRangeFacetFieldModel(facetFieldName || '', settings));
                }
            }
        });

        return facetFields;
    }

    static parseDateIsoString(value: any): string | null {
        if (!isNaN(Date.parse(value))) {
            return (new Date(value)).toISOString();
        }

        return value;
    }

    static createDateRangeFacetFieldModel(facetFieldName: string, settings: FacetSettings): Facet {
        const rangeList: CustomFacetRange[] = [];
        settings.DateRanges!.forEach((range: DateRange)=> {
            let valueFrom = this.parseDateIsoString(range.From);
            let valueTo = this.parseDateIsoString(range.To);

            if (valueFrom != null && valueTo != null) {
                rangeList.push({ From: valueFrom as string, To: valueTo as string });
            }
        });

        return {
            FieldName: facetFieldName,
            CustomIntervals: rangeList,
            FacetFieldType: settings.FacetType!,
            SitefinityFacetType: SitefinityFacetType.Range
        };
    }

    static createNumberRangeFacetFieldModel(facetFieldName: string, settings: FacetSettings, culture: string): Facet {
        const rangeList: CustomFacetRange[] =[];
        if (settings.NumberRanges != null) {
            rangeList.push(...settings
                .NumberRanges
                .map((range: NumberRange) => {
                    return {
                        From: range.From != null ? range.From.toString() : null,
                        To: range.To != null ? range.To.toString() : null
                    } as CustomFacetRange;
            }));
        }

        if (settings.NumberRangesDecimal != null) {
            rangeList.push(...settings
                .NumberRangesDecimal
                .map((range: NumberRange) => {
                    return {
                        From: range.From != null ? new Intl.NumberFormat(culture).format(range.From).toString() : null,
                        To: range.To != null ? new Intl.NumberFormat(culture).format(range.To).toString() : null
                    } as CustomFacetRange;
                }));
        }

        return {
            FieldName: facetFieldName,
            CustomIntervals: rangeList,
            FacetFieldType: settings.FacetType!,
            SitefinityFacetType: SitefinityFacetType.Range
        };
    }

    static createDateIntervalFacetFieldModel(facetFieldName: string, settings: FacetSettings): Facet {
        return {
            FieldName: facetFieldName,
            IntervalRange: this.getIntervalDateTime(settings.DateStep!),
            FacetFieldType: settings.FacetType!,
            SitefinityFacetType: SitefinityFacetType.Interval
        };
    }

    static createNumberIntervalFacetFieldModel(facetFieldName: string, settings: FacetSettings): Facet {
        return {
            FieldName: facetFieldName,
            IntervalRange: settings.NumberStep != null ? settings.NumberStep.toString() : null,
            FacetFieldType: settings.FacetType!,
            SitefinityFacetType: SitefinityFacetType.Interval
        };
    }

    static createValueFacetFieldModel(facetFieldName: string, settings: FacetSettings): Facet {
        return {
            FieldName: facetFieldName,
            SitefinityFacetType: SitefinityFacetType.Value,
            FacetFieldType: settings.FacetType!
        };
    }

    public static DateTimeFormat = 'yyyy-MM-ddTHH:mm:ss.fffZ';
}
