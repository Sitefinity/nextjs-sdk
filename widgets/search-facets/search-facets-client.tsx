'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchFacetModel } from './search-facets-class';
import { SearchFacetsViewProps } from './search-facets.view-props';
import { FacetGroup } from './components/facet-group';
import { SelectedFacetsState } from './interfaces/selected-facet-state';
import { RANGE_SEPARATOR, computeFacetRangeLabelForType, getCheckboxId, getFacetKeyFromCheckboxId } from './components/utils';
import { getFacets, getInitialFacetsWithModels, getSearchFacets, getSelectedFacetsToBeUsed, updateFacetsViewProps } from './search-facets-common';
import { SearchFacetsEntity } from './search-facets.entity';
import { useRouter, useSearchParams } from 'next/navigation';
import { getQueryParams } from '../common/query-params';

const FILTER_QUERY_PARAM = 'filter';

interface GroupedCheckedFacets {
    [key: string]: {
        filterValue: string;
        isCustom: boolean;
    }[]
}

interface AppliedFilterObject {
    appliedFilters: {
        fieldName: string;
        filterValues: { filterValue: string; isCustom: boolean; }[]
    }[];
    lastSelectedFilterGropName: string;
    isDeselected: boolean;
}

export function SearchFacetsClient(viewProps: SearchFacetsViewProps<SearchFacetsEntity>) {
    const searchParamsNext = useSearchParams();
    const router = useRouter();
    const queryParams = getQueryParams(searchParamsNext);
    const [showClearButton, setShowClearButton] = useState(!!queryParams[FILTER_QUERY_PARAM]);
    const [sf, setSearchFacets] = useState<SearchFacetModel[]>([]);
    const [hasFacetElements, setHasAnyFacetElements] = useState<boolean>(false);

    const markSelectedInputs = useCallback(() => {
        const filterQuery = getQueryParams(searchParamsNext)[FILTER_QUERY_PARAM];
        if (filterQuery) {
            const decodedFilterParam = atob(filterQuery);
            const jsonFilters: AppliedFilterObject = JSON.parse(decodedFilterParam);
            const newCheckedInputs: SelectedFacetsState = {};

            jsonFilters.appliedFilters.forEach(function (filter: { filterValues: any[], fieldName: string }) {
                filter.filterValues.forEach(function (fvObj: {filterValue: string, isCustom: boolean}) {
                    const fieldName = decodeURIComponent(filter.fieldName);
                    const filterValue = decodeURIComponent(fvObj.filterValue);
                    let searchFacets: SearchFacetModel[] = JSON.parse(JSON.stringify(sf));
                    let facetElement = searchFacets
                        .find(x => x.FacetFieldName === fieldName)?.FacetElements
                            .find(x => x.FacetValue === filterValue);
                    let label: string = facetElement?.FacetLabel || '';
                    let mainValue: string = '';

                    if (!facetElement && fvObj.isCustom && filterValue.includes(RANGE_SEPARATOR)) {
                        let facetField = searchFacets.find(x => x.FacetFieldName === fieldName);

                        facetElement = facetField?.FacetElements
                            .find(x => x.FacetValue?.includes(RANGE_SEPARATOR));

                        const [from, to] = filterValue.split(RANGE_SEPARATOR);
                        label = facetField ? computeFacetRangeLabelForType(facetField!.FacetFieldType, from, to) : '';
                        mainValue = facetElement?.FacetValue!;
                    }

                    if (facetElement || searchFacets.find(x => x.FacetFieldName === fieldName && x.facetField?.FacetFieldSettings?.DisplayCustomRange)) {
                        let inputId = getCheckboxId(fieldName, mainValue || filterValue);
                        newCheckedInputs[inputId] = {
                            facetLabel: label,
                            facetName: fieldName,
                            facetValue: filterValue,
                            facetDefaultValue: mainValue || filterValue,
                            isCustom: !!fvObj.isCustom
                        };
                    }

                });
            });

            return newCheckedInputs;
        }

        return {};
    }, [searchParamsNext, sf]);

    const initialSelectedInputs = useMemo(() => {
        return markSelectedInputs();
    }, [markSelectedInputs]);

    const [selectedFacets, setSelectedFacets] = useState<SelectedFacetsState>(initialSelectedInputs);

    useEffect(() => {
        getInitialFacetsWithModels(queryParams, viewProps.widgetContext.model.Properties).then(({searchFacets, hasAnyFacetElements}) => {
            setSearchFacets(searchFacets);
            setHasAnyFacetElements(hasAnyFacetElements);
        });
    }, []);

    useEffect(() => {
        const newSearchParams = getQueryParams(searchParamsNext);
        if (!newSearchParams[FILTER_QUERY_PARAM]) {
            setSelectedFacets({}); // clear selected facets
            setShowClearButton(false);
        }

        const getNewSearchFacets = async () => {
            if (sf?.length) {
                const selectedFacetsToBeUsed = getSelectedFacetsToBeUsed(sf);
                const facets = getFacets(selectedFacetsToBeUsed, newSearchParams);
                const facetResponse = await getSearchFacets(
                    newSearchParams.searchQuery,
                    newSearchParams.sf_culture,
                    newSearchParams.indexCatalogue,
                    newSearchParams.filter,
                    newSearchParams['resultsForAllSites'],
                    null,
                    facets
                );

                const { searchFacets, hasAnyFacetElements }= await updateFacetsViewProps(newSearchParams, facetResponse, selectedFacetsToBeUsed);
                setSearchFacets(searchFacets);
                setHasAnyFacetElements(hasAnyFacetElements);
            } else {
                getInitialFacetsWithModels(queryParams, viewProps.widgetContext.model.Properties).then(({searchFacets, hasAnyFacetElements}) => {
                    setSearchFacets(searchFacets);
                    setHasAnyFacetElements(hasAnyFacetElements);
                });
            }
        };

        getNewSearchFacets();
    }, [viewProps, searchParamsNext]); // eslint-disable-line

    const clearButtonClick = () => {
        setSelectedFacets({});
        searchWithFilter(null, {});
    };

    const groupAllCheckedFacetInputs = useCallback((currentSelectedFacets: SelectedFacetsState): GroupedCheckedFacets => {
        let groupedFilters: GroupedCheckedFacets = {};

        Object.keys(currentSelectedFacets).sort().forEach((facetId: string) => {
            const selectedFacet = currentSelectedFacets[facetId];
            const facetKey = selectedFacet.facetName;
            const filterValueObj = {
                filterValue: selectedFacet.facetValue,
                isCustom: selectedFacet.isCustom
            };

            if (groupedFilters.hasOwnProperty(facetKey)) {
                groupedFilters[facetKey].push(filterValueObj);
            } else {
                groupedFilters[facetKey] = [filterValueObj];
            }

        });

        return groupedFilters;
    }, []);

    const buildFilterObjectBasedOnPopulatedInputs = useCallback((id: string | null, newSelectedFacets: SelectedFacetsState) => {
        let groupedFilters = groupAllCheckedFacetInputs(newSelectedFacets);
        let lastSelectedElementKey: any;
        let isDeselected = false;

        if (id) {
            const eventTargetElement = selectedFacets[id];
            lastSelectedElementKey = getFacetKeyFromCheckboxId(id);
            isDeselected = !!eventTargetElement;
        }

        let filterObject = constructFilterObject(groupedFilters, lastSelectedElementKey!, isDeselected);

        return filterObject;
    }, [groupAllCheckedFacetInputs, selectedFacets]);

    const searchWithFilter = useCallback((inputId: string | null, newSelectedFacets: SelectedFacetsState) => {
        const currentFilterObject = buildFilterObjectBasedOnPopulatedInputs(inputId, newSelectedFacets);
        let filterString = JSON.stringify(currentFilterObject);
        const newSearchParam = { ...queryParams };
        delete newSearchParam['slug'];
        if (currentFilterObject && currentFilterObject.appliedFilters && currentFilterObject.appliedFilters.length > 0) {
            let encodedFilterString = btoa(filterString);
            newSearchParam[FILTER_QUERY_PARAM] = encodedFilterString;
            setShowClearButton(true);

        } else {
            delete newSearchParam[FILTER_QUERY_PARAM];
            setShowClearButton(false);
        }

        let url = buildUrl(newSearchParam);
        router.push(url);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams, buildFilterObjectBasedOnPopulatedInputs]);

    function handleChipDeleteClick(facetKey: string, facetValue: string) {
        const newSelectedFacets = {...selectedFacets};
        delete newSelectedFacets[getCheckboxId(facetKey, facetValue)];
        setSelectedFacets(newSelectedFacets);
        searchWithFilter(getCheckboxId(facetKey, facetValue), newSelectedFacets);
    }

    function buildUrl(queryStringParams: { [key: string]: string; }) {
        let currentLocation = window.location.href.split('?')[0];

        const url = new URL(currentLocation);

        // return the pager to 0
        delete queryStringParams.page;
        url.search = Object.entries(queryStringParams)
            .map(([key, value]) => {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = key === 'filter' ? value || '' : encodeURIComponent(value || '');
                return `${encodedKey}=${encodedValue}`;
            })
            .join('&');

        return url.toString();
    }

    function constructFilterObject(groupedFilters: GroupedCheckedFacets, lastSelectedElementKey: string, isDeselected: boolean): AppliedFilterObject {
        const currentFilterObject: AppliedFilterObject = {
            appliedFilters: Object.keys(groupedFilters).map((el) => {
                return {
                    fieldName: encodeURIComponent(el),
                    filterValues: groupedFilters[el].map((filter) => ({
                        ...filter,
                        filterValue: encodeURIComponent(filter.filterValue)
                    }))
                } as { fieldName: string; filterValues: { filterValue: string; isCustom: boolean; }[]; };
            }),
            lastSelectedFilterGropName: lastSelectedElementKey,
            isDeselected: isDeselected
        };

        return currentFilterObject;
    }

    const facetValueChanged = (facetName: string, facetValue: string, facetDefaultValue: string, facetLabel: string, isDeselected: boolean, isCustom: boolean, newSelectedFacets: SelectedFacetsState ) => {
        const checkboxId = getCheckboxId(facetName, facetValue);
        const currentSelectedFacets: SelectedFacetsState = newSelectedFacets !== null ? newSelectedFacets : JSON.parse(JSON.stringify(selectedFacets));
        const existingCustomSelectedFacets = Object.values(currentSelectedFacets).filter(f => (f.facetName === facetName) && f.isCustom);

        if (!isCustom && existingCustomSelectedFacets.length > 0) {
            existingCustomSelectedFacets.forEach((f) => {
                const id = getCheckboxId(f.facetName, f.facetValue);
                delete currentSelectedFacets[id];
            });
        }

        if (isDeselected) {
            delete currentSelectedFacets[checkboxId];
        } else {

            currentSelectedFacets[checkboxId] = {
                facetName,
                facetLabel,
                facetValue,
                facetDefaultValue,
                isCustom
            };
        }

        setSelectedFacets(currentSelectedFacets);
        searchWithFilter(checkboxId, currentSelectedFacets);
    };

    const deselectFacetGroup = (facetName: string) => {
        let selectedFacetsClone: SelectedFacetsState = JSON.parse(JSON.stringify(selectedFacets));
        let newSelectedFacets = removeGroup(facetName, selectedFacetsClone);

        return newSelectedFacets;
    };

    const removeGroup = (facetName: string, newSelectedFacets: SelectedFacetsState) => {
        const newFacets: SelectedFacetsState = {};

        Object.keys(newSelectedFacets).forEach(key => {
            const value = newSelectedFacets[key];
            if (facetName !== value.facetName) {
                newFacets[key] = value;
            }
        });

        return newFacets;
    };

    return (
      <>
        {(hasFacetElements || (!!viewProps.indexCatalogue && viewProps.isEdit) || !!Object.keys(selectedFacets).length) &&
        (<>
          <h3 className="h6 mb-3 fw-normal">{viewProps.filterResultsLabel}</h3>
          {(hasFacetElements || !!Object.keys(selectedFacets).length) &&
          <>
            <div className="d-flex align-items-center justify-content-between">
              <label className="form-label">{viewProps.appliedFiltersLabel}</label>
              {showClearButton && <button onClick={clearButtonClick} id="sf-facet-clear-all-btn" className="btn btn-link px-0 py-0 mb-2 text-decoration-none">
                {viewProps.clearAllLabel}
              </button>}
            </div>
            <ul id="applied-filters" className="list-unstyled list-inline"
                // data-sf-applied-filter-html-tag="li"
                // data-sf-filter-label-css-className="list-inline-item bg-secondary bg-opacity-10 rounded-pill
                // ps-2 pe-4 pb-1 me-1 mb-1 mw-100 position-relative overflow-hidden text-truncate text-nowrap" data-sf-remove-filter-css-className="px-2 position-absolute end-0"
                >
              {Object.entries(selectedFacets).map(([_, value], idx: number) => {
                const {facetName, facetLabel, facetValue, facetDefaultValue} = value;
                return value && <li
                  key={idx}
                  className={'list-inline-item bg-secondary bg-opacity-10 rounded-pill ps-2 pe-4 pb-1 me-1 mb-1 mw-100 position-relative overflow-hidden text-truncate text-nowrap'}
                >{facetLabel}
                  <span onClick={() => handleChipDeleteClick(facetName, facetDefaultValue)} id={`remove-facet-filter-${facetName}-${facetValue}`} role="button"
                    tabIndex={0} title="Remove" className="px-2 position-absolute end-0">✕</span>
                </li>;
                    })
                }
            </ul>
          </>
            }
        </>)}
        {sf && <div id="facetContainer" className="mb-3">
            {sf.map((facet: SearchFacetModel, sfIdx: number) => {
                return <FacetGroup key={sfIdx} viewProps={viewProps} facet={facet} facetValueChanged={facetValueChanged} deselectFacetGroup={deselectFacetGroup} selectedFacets={selectedFacets} />;
            })
        }
        </div>
            }
      </>
    );
}
