'use client';

import React, { useCallback } from 'react';
import { SearchFacetModel, SearchFacetModelExtensions } from '../search-facets-class';
import { FacetElement } from '../interfaces/facet-element';
import { SearchFacetsViewModel } from '../search-facets-viewmodel';
import { SelectedFacetsState } from '../interfaces/selected-facet-state';
import { FacetCustomRange } from './facet-custom-range';
import { RANGE_SEPARATOR, getCheckboxId, formatDateValue, DATE_AND_TIME } from './utils';

export function FacetGroup(props: { facet: SearchFacetModel, viewModel: SearchFacetsViewModel , facetValueChanged: any, deselectFacetGroup: any, selectedFacets: SelectedFacetsState }) {
    const { facet, viewModel, facetValueChanged, deselectFacetGroup, selectedFacets } = {...props};
    const defaultFacetsCollapseCount = 10;
    let value = 0;

    const [moreLessLabel, setMoreLessLabel] = React.useState({ 'labelToDisplay': viewModel.ShowMoreLabel, isShowMoreSelected: true });

    const showMoreLessClick = () => {
        const newMoreLessLabel = moreLessLabel.isShowMoreSelected
            ? { 'labelToDisplay': viewModel.ShowLessLabel, isShowMoreSelected: false }
            : { 'labelToDisplay': viewModel.ShowMoreLabel, isShowMoreSelected: true };
        setMoreLessLabel(newMoreLessLabel);
    };

    const facetCheckboxChanged = (e: React.ChangeEvent<HTMLInputElement>, facetName: string, facetValue: string, facetLabel: string) => {
        const checked = e.target.checked;
        facetValueChanged(facetName, facetValue, facetValue, facetLabel, !checked, false, null);
    };

    const customRangeApplied = (facetFieldName: string, facetChipValue: string, facetInitialValue: string, facetChipLabel: string, checkboxId: string) => {
        let isCustomRange = true;

        if (!facetChipValue?.includes(RANGE_SEPARATOR) || facetChipValue === facetInitialValue) {
            isCustomRange = false;
        }

        if (isCustomRange && facetInitialValue !== facetChipValue) {
            facetInitialValue = facetChipValue;
        }

        // uncheckCheckboxesFromGroup
        let newSelectedFacets: SelectedFacetsState = deselectFacetGroup(facetFieldName);

        facetValueChanged(facetFieldName, facetChipValue, facetInitialValue, facetChipLabel, false, isCustomRange, newSelectedFacets);
    };

    const checkboxChecked = (selectedFacet: any) => {
        return !!selectedFacet && selectedFacet.facetDefaultValue === selectedFacet.facetValue;
    };

    const getFormattedDate = (selectedFacet: any, elementNumber: number) => {
        let date = selectedFacet ? selectedFacet.facetValue.split(RANGE_SEPARATOR)[elementNumber] : '';
        return formatDateValue(date);
    };

    const getSelectedFacet = useCallback((rangeFacet: any) => {
        let selectedFacet;
        if (!rangeFacet){
            Object.keys(selectedFacets).forEach(key => {
                const value = selectedFacets[key];
                if (value && facet.FacetFieldName === value.facetName) {
                    selectedFacet = value;
                }
            });
        } else {
            const checkboxId = getCheckboxId(facet.FacetFieldName, rangeFacet?.FacetValue!);
            selectedFacet = selectedFacets[checkboxId];
            if (selectedFacet && selectedFacet.facetDefaultValue === selectedFacet.facetValue) {
                selectedFacet = null;
            }
        }

        return selectedFacet;
    }, [selectedFacets]); // eslint-disable-line

    const getFormattedValuesToDisplay = (facet: any, selectedFacet: { facetName: string; facetValue: string; facetDefaultValue: string; facetLabel: string; isCustom: boolean; } | null | undefined): [any, any] => {
        let fromV: string;
        let toV: string;
        if (facet.FacetFieldType === DATE_AND_TIME) {
            fromV = getFormattedDate(selectedFacet, 0);
            toV = getFormattedDate(selectedFacet, 1);
        } else {
            fromV = selectedFacet ? selectedFacet.facetValue.split(RANGE_SEPARATOR)[0] : '';
            toV = selectedFacet ? selectedFacet.facetValue.split(RANGE_SEPARATOR)[1] : '';
        }

        return [fromV, toV];
    };

    return (<React.Fragment>
      {(facet.FacetElements.length || SearchFacetModelExtensions.ShowNumberCustomRange(facet) || SearchFacetModelExtensions.ShowDateCustomRanges(facet)) && <>
        <h4 className="h6 fw-normal mt-3" >{facet.FacetTitle}</h4>

        <ul
          className="list-unstyled mb-0" id={`facets-group-list-${facet.FacetFieldName}`}
          data-facet-type={facet.FacetFieldType}>
          {facet.FacetElements.map((facetElement: FacetElement, idx: number) => {
                    value++;
                    const hideElement: boolean = (value > defaultFacetsCollapseCount)
                        && viewModel.IsShowMoreLessButtonActive
                        && moreLessLabel['isShowMoreSelected'] === true;
                    const encodedName = facet.FacetFieldName || '';
                    const encodedValue = facetElement.FacetValue || '';
                    const checkboxId = getCheckboxId(encodedName, encodedValue);
                    const selectedFacet = selectedFacets[checkboxId];

                    return (<li
                      key={idx}
                      hidden={hideElement}
                    >
                      <input type="checkbox"
                        onChange={(e) => facetCheckboxChanged(e, encodedName, encodedValue, facetElement.FacetLabel!)}
                        id={checkboxId}
                        data-facet-key={encodedName}
                        data-facet-value={encodedValue}
                        checked={checkboxChecked(selectedFacet)} />
                      <label htmlFor={checkboxId}
                        id={`facet-${encodedName}-${encodedValue}`}>
                        {facetElement.FacetLabel}
                      </label>
                      {
                            viewModel.DisplayItemCount && <span className="small text-muted">({facetElement.FacetCount})</span>
                        }
                    </li>);
                })
                }
        </ul>
        </>}
      {
            (facet.FacetElements.length > defaultFacetsCollapseCount && viewModel.IsShowMoreLessButtonActive) &&
            <button onClick={showMoreLessClick} type="button" className="btn btn-link p-0 text-decoration-none"
              data-facet-type={facet.FacetFieldName} id={`show-more-less-${facet.FacetFieldName}`}>
                {moreLessLabel['labelToDisplay']}
            </button>
        }
      {(SearchFacetModelExtensions.ShowNumberCustomRange(facet) || SearchFacetModelExtensions.ShowDateCustomRanges(facet)) &&
            (() => {
                const rangeFacet = facet.FacetElements.find(x => x.FacetValue?.includes(RANGE_SEPARATOR));
                const selectedFacet = getSelectedFacet(rangeFacet);
                const [fromV, toV] = getFormattedValuesToDisplay(facet, selectedFacet);

                return (
                  <FacetCustomRange
                    facet={facet}
                    facetElement={rangeFacet || {}}
                    fromValue={fromV}
                    toValue={toV}
                    selectedFacets={selectedFacets}
                    customRangeApplied={customRangeApplied} />
                );
            })()
        }
    </React.Fragment>);
}
