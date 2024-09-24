'use client';

import { Suspense, useEffect, useState } from 'react';
import { LoadingIndicator } from './loading-indicator';
import { SearchResultsViewProps } from './interfaces/search-results.view-props';
import { SearchParams } from './interfaces/search-params';
import { OrderByDropDown } from './orderby-dropdown';
import { LanguagesList } from './languages-list';
import { SearchResultDocumentDto } from '../../rest-sdk/dto/search-results-document-dto';
import { SanitizerService } from '../../services/sanitizer-service';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { SearchResultsEntity } from './search-results.entity';
import { Pager } from '../pager/pager';
import { PagerMode } from '../common/page-mode';
import { performSearch } from './search-results-common';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPageNumber } from '../pager/pager-view-model';
import { getUniqueId } from '../../editor/utils/getUniqueId';
import { getQueryParams } from '../common/query-params';

export function SearchResultsClient(props: SearchResultsViewProps<SearchResultsEntity>) {
    const searchParamsNext = useSearchParams();
    const router = useRouter();
    const searchParams = getQueryParams(searchParamsNext);
    const sortingSelectId = getUniqueId('sf-sort-', props.widgetContext.model.Id);
    const context = props.widgetContext.requestContext;
    const entity = props.widgetContext.model.Properties;
    const sorting = searchParams.orderBy ?  searchParams.orderBy : (props.sorting || '');
    const defaultResultsValue = context.isEdit ? {totalCount: 0, searchResults: []} : undefined;
    const [searchResults, setSearchResults] = useState<{ totalCount: number, searchResults: SearchResultDocumentDto[] | any[] } | null | undefined>(defaultResultsValue);
    if (!Object.keys(context.searchParams).length){
      context.searchParams = searchParams;
    }

    const currentPage = getPageNumber(PagerMode.QueryParameter, context);

    let initialHeader = '';
    if (entity.SearchResultsHeader) {
      initialHeader = entity.SearchResultsHeader.replace('\"{0}\"', '');
    }

    if (entity.NoResultsHeader) {
      initialHeader = entity.NoResultsHeader.replace('{0}', searchParams.searchQuery || '');
    }

    const [resultsHeader, setResultsHeader] = useState<string>(initialHeader);

    const loadResults = async (newSearchParams: SearchParams) => {
      const searchResponse = await performSearch(entity, newSearchParams);
      setSearchResults(searchResponse);
      if (entity.SearchResultsHeader && searchResponse?.searchResults?.length) {
        setResultsHeader(entity.SearchResultsHeader.replace('{0}', searchParams.searchQuery));
      }
    };

    useEffect(() => {
      !context.isEdit && loadResults(getQueryParams(searchParamsNext) as SearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParamsNext]);

    return ((searchParams.searchQuery || context.isEdit) &&
      <>
        { searchResults === undefined && <LoadingIndicator /> }
        { searchResults !== undefined &&
        <>
          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 role="alert" aria-live="assertive">{resultsHeader}</h1>
            <div className="d-flex align-items-center gap-2">
              {(props.allowUsersToSortResults && !!searchResults?.totalCount && searchResults?.totalCount > 0) &&
              <>
                <label htmlFor={sortingSelectId} className="form-label text-nowrap mb-0">
                  {props.sortByLabel}
                </label>
                <OrderByDropDown queryParams={searchParams}
                  sortingSelectId={sortingSelectId}
                  searchParams={searchParams as SearchParams}
                  sorting={sorting} />
              </>
                }
            </div>
          </div>
          <div>
            <h4>{searchResults?.totalCount} {props.resultsNumberLabel}</h4>
            <Suspense fallback={<LoadingIndicator/>}>
              <p>
                {props.languagesLabel + ' '}
                <LanguagesList
                  queryParams={searchParams}
                  languages={props.languages}
                  searchParams={searchParams as SearchParams} />
              </p>
            </Suspense>
          </div>
          <Suspense fallback={<LoadingIndicator/>}>
            <div className="mt-4">
              {searchResults?.searchResults.map((item: SearchResultDocumentDto, idx: number) => {
              const hasLink: boolean = !!item.Link;
              return (
                <div className="mb-3 d-flex" key={idx}>
                  {item.ThumbnailUrl &&
                  <div className="flex-shrink-0 me-3">
                    <a href={item.Link}>
                      <img src={item.ThumbnailUrl} alt={item.Title} width="120" />
                    </a>
                  </div>
                    }
                  <div className="flex-grow-1">
                    <h3 className="mb-1">
                      {hasLink ?
                        <a className="text-decoration-none" href={item.Link}>{item.Title}</a> : (item.Title)
                            }
                    </h3>
                    <p className="mb-1" dangerouslySetInnerHTML={{ __html: SanitizerService.getInstance().sanitizeHtml(item.HighLighterResult) as any }} />
                    {hasLink && <a className="text-decoration-none" href={item.Link}>{item.Link}</a>}
                  </div>
                </div>
              );
            })}
            </div>
          </Suspense>
          {searchResults?.searchResults && entity.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
          <Suspense fallback={<LoadingIndicator/>}>
            <div className="mt-4" id="sf-search-result-pager">
              <Pager
                currentPage={currentPage}
                itemsTotalCount={searchResults?.totalCount}
                pagerMode={PagerMode.QueryParameter}
                itemsPerPage={entity.ListSettings?.ItemsPerPage}
                navigateFunc={router.push}
                context={context} />
            </div>
          </Suspense>
        }
        </>}
      </>
    );
}
