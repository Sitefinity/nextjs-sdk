'use client';

import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { LoadingIndicator } from './loading-indicator';
import { SearchResultsViewModel } from './interfaces/search-results-viewmodel';
import { SearchParams } from './interfaces/search-params';
import { OrderByDropDown } from './orderby-dropdown';
import { RequestContext } from '../../editor/request-context';
import { LanguagesList } from './languages-list';
import { SearchResultDocumentDto } from '../../rest-sdk/dto/search-results-document-dto';
import { SanitizerService } from '../../services/sanitizer-service';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { SearchResultsEntity } from './search-results.entity';
import { Pager } from '../pager/pager';
import { PagerMode } from '../common/page-mode';
import { EVENTS, useSfEvents } from '../../pages/useSfEvents';
import { performSearch, updateSearchResultsHeader, updateViewModel } from './search-results-common';

export function SearchResultsClient(props: {
     viewModel: SearchResultsViewModel,
     searchParams: SearchParams,
     sortingSelectId: string,
     context: RequestContext,
     sorting: string,
     entity: SearchResultsEntity,
     currentPage: number,
     ctx: any
     }) {
    const { viewModel, searchParams, sortingSelectId, context, sorting, entity, currentPage, ctx } = props;
    const [payload, setPayload] = useSfEvents<{[key: string]: any, attach?: boolean}>(EVENTS.FACETS, true);
    const [searchResultsClientProps, setSearchResultsClientProps] = useState({ searchParams, entity, viewModel });

    useEffect(() => {
        if (payload) {
            const newSearchParams = (payload as unknown) as SearchParams;

            const fetchData = async () =>{
                const searchResponse = await performSearch(entity, newSearchParams, ctx);
                updateViewModel(viewModel, searchResponse);
                updateSearchResultsHeader(entity, viewModel, searchParams);
                setSearchResultsClientProps({searchParams: newSearchParams, entity, viewModel});
            };

            fetchData();
        }
    }, [payload, entity, viewModel]); // eslint-disable-line

    return (
      <>
        <div className="d-flex align-items-center justify-content-between my-3">
          <h1 role="alert" aria-live="assertive">{searchResultsClientProps.viewModel.ResultsHeader}</h1>
          <div className="d-flex align-items-center gap-2">
            {(searchResultsClientProps.viewModel.AllowUsersToSortResults && !!searchResultsClientProps.viewModel.TotalCount && searchResultsClientProps.viewModel.TotalCount > 0) &&
              <>
                <label htmlFor={sortingSelectId} className="form-label text-nowrap mb-0">
                  {searchResultsClientProps.viewModel.SortByLabel}
                </label>
                <OrderByDropDown context={context} sortingSelectId={sortingSelectId} searchParams={searchResultsClientProps.searchParams} sorting={sorting} />
              </>
                }
          </div>
        </div>
        <div>
          <h4>{searchResultsClientProps.viewModel.TotalCount} {searchResultsClientProps.viewModel.ResultsNumberLabel}</h4>
          <Suspense fallback={<LoadingIndicator/>}>
            <p>
              {searchResultsClientProps.viewModel.LanguagesLabel + ' '}
              <LanguagesList context={context} languages={searchResultsClientProps.viewModel.Languages} searchParams={searchResultsClientProps.searchParams} />
            </p>
          </Suspense>
        </div>
        <Suspense fallback={<LoadingIndicator/>}>
          <div className="mt-4">
            {searchResultsClientProps.viewModel.SearchResults.map((item: SearchResultDocumentDto, idx: number) => {
              const hasLink: boolean = !!item.Link;
              return (
                <div className="mb-3 d-flex" key={idx}>
                  {item.ThumbnailUrl &&
                  <div className="flex-shrink-0 me-3">
                    <a href={item.Link}>
                      <Image src={item.ThumbnailUrl} alt={item.Title} width="120" />
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
        {searchResultsClientProps.viewModel.SearchResults && searchResultsClientProps.entity.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
        <Suspense fallback={<LoadingIndicator/>}>
          <div className="mt-4" id="sf-search-result-pager">
            <Pager
              currentPage={currentPage}
              itemsTotalCount={searchResultsClientProps.viewModel.TotalCount}
              pagerMode={PagerMode.QueryParameter}
              itemsPerPage={searchResultsClientProps.entity.ListSettings?.ItemsPerPage}
              context={context}
              traceContext={ctx} />
          </div>
        </Suspense>
        }
      </>
    );
}
