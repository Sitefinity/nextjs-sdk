import Image from 'next/image';

import { StyleGenerator } from '../styling/style-generator.service';
import { SearchResultDocumentDto } from '../../rest-sdk/dto/search-results-document-dto';
import { SearchResultsSorting } from './interfaces/search-results-sorting';
import { SearchResultsViewModel } from './interfaces/search-results-viewmodel';
import { OrderByDropDown } from './orderby-dropdown';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { Pager } from '../pager/pager';
import { PagerMode } from '../common/page-mode';
import { getPageNumber } from '../pager/pager-view-model';
import { classNames } from '../../editor/utils/classNames';
import { getUniqueId } from '../../editor/utils/getUniqueId';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestClient } from '../../rest-sdk/rest-client';
import { SearchResultsEntity } from './search-results.entity';
import { SanitizerService } from '../../services/sanitizer-service';
import { ContentListSettings } from './content-list-settings';
import { SearchParams } from './interfaces/search-params';
import { LanguagesList } from './languages-list';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function SearchResults(props: WidgetContext<SearchResultsEntity>) {
  const {span, ctx} = Tracer.traceWidget(props, true);
    const dataAttributes = htmlAttributes(props);
    const entity = props.model.Properties;

    const context = props.requestContext;
    const searchParams = (context.searchParams as unknown) as SearchParams;

    const cultures = context.layout.Site.Cultures;
    const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

    const languages: {Name: string, Title: string}[] = cultures.map((culture: string) => {
        return {
          Name: culture,
          Title: languageNames.of(culture) || culture
        };
    });

    const viewModel: SearchResultsViewModel  = {
        SearchResults: [],
        ResultsHeader: '',
        LanguagesLabel: entity.LanguagesLabel,
        ResultsNumberLabel: entity.ResultsNumberLabel,
        Attributes: entity.Attributes,
        CssClass: entity.CssClass || undefined,
        Languages: languages,
        AllowUsersToSortResults: entity.AllowUsersToSortResults,
        Sorting: entity.Sorting.toString(),
        SortByLabel: entity.SortByLabel,
        TotalCount: 0
    };

    entity.ListSettings = entity.ListSettings || { ItemsPerPage: 20, LimitItemsCount: 20, ShowAllResults: false, DisplayMode: ListDisplayMode.All };

    if (entity.SearchResultsHeader) {
        viewModel.ResultsHeader = entity.SearchResultsHeader.replace('\"{0}\"', '');
    }

    if (entity.NoResultsHeader) {
        viewModel.ResultsHeader = entity.NoResultsHeader.replace('\"{0}\"', searchParams.searchQuery || '\"\"');
    }

    if (searchParams.searchQuery) {
        const response = await performSearch(entity, searchParams, ctx);
        viewModel.TotalCount = response?.totalCount || 0;
        viewModel.SearchResults = response?.searchResults || [];

        if (entity.SearchResultsHeader) {
            if (viewModel.SearchResults && viewModel.SearchResults.length > 0) {
                viewModel.ResultsHeader = entity.SearchResultsHeader.replace('{0}', searchParams.searchQuery);
            }
        }
    }

    const defaultClass =  entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const searchResultsCustomAttributes = getCustomAttributes(entity.Attributes, 'SearchResults');

    dataAttributes['className'] = classNames(defaultClass, marginClass);

    let orderByQuery = searchParams.orderBy;
    let sorting = orderByQuery ? orderByQuery : (viewModel.Sorting || '');
    let sortingSelectId = getUniqueId('sf-sort-');
    const currentPage = getPageNumber(PagerMode.QueryParameter, context);
    return  (context.searchParams.searchQuery || context.isEdit) && (
    <>
      {
        <div className={viewModel.CssClass}
          {...dataAttributes}
          {...searchResultsCustomAttributes}
          id="sf-search-result-container"
          data-sf-role="search-results"
          data-sf-search-query={searchParams['searchQuery']}
          data-sf-search-catalogue={searchParams['indexCatalogue']}
          data-sf-words-mode={searchParams['wordsMode']}
          data-sf-language={searchParams['sf_culture']}
          data-sf-scoring-info={searchParams['scoringInfo']}
          data-sf-results-all={searchParams['resultsForAllSites']}
          data-sf-sorting={sorting}
          data-sf-filter={searchParams['filter']}>

          <div className="d-flex align-items-center justify-content-between my-3">
            <h1 role="alert" aria-live="assertive">{viewModel.ResultsHeader}</h1>
            <div className="d-flex align-items-center gap-2">
              {(viewModel.AllowUsersToSortResults && viewModel.TotalCount && viewModel.TotalCount > 0) &&
                <>
                  <label htmlFor={sortingSelectId} className="form-label text-nowrap mb-0">
                    {viewModel.SortByLabel}
                  </label>
                  <OrderByDropDown context={context} sortingSelectId={sortingSelectId} searchParams={searchParams} sorting={sorting} />
                </>
               }
            </div>
          </div>
          <div>
            <h4>{viewModel.TotalCount} {viewModel.ResultsNumberLabel}</h4>
            <p data-sf-hide-while-loading="true">
              {viewModel.LanguagesLabel + ' '}
              <LanguagesList context={context} languages={viewModel.Languages} searchParams={searchParams}/>
            </p>
          </div>
          <div className="mt-4" data-sf-hide-while-loading="true">
            {viewModel.SearchResults.map((item: SearchResultDocumentDto, idx: number) => {
                const hasLink: boolean = !!item.Link;
                return (
                  <div className="mb-3 d-flex" key={idx}>
                    { item.ThumbnailUrl &&
                      <div className="flex-shrink-0 me-3">
                        <a href={item.Link}>
                          <Image src={item.ThumbnailUrl} alt={item.Title} width="120" />
                        </a>
                      </div>
                    }
                    <div className="flex-grow-1">
                      <h3 className="mb-1">
                        {hasLink ?
                          <a className="text-decoration-none" href={item.Link}>{item.Title}</a> :
                        (item.Title)
                      }
                      </h3>
                      <p className="mb-1" dangerouslySetInnerHTML={{ __html: SanitizerService.getInstance().sanitizeHtml(item.HighLighterResult) as any }} />
                      { hasLink && <a className="text-decoration-none" href={item.Link}>{item.Link}</a> }
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
        }
      {viewModel.SearchResults && entity.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
        <div className="mt-4" id="sf-search-result-pager" data-sf-hide-while-loading="true">
          <Pager
            currentPage={currentPage}
            itemsTotalCount={viewModel.TotalCount}
            pagerMode={PagerMode.QueryParameter}
            itemsPerPage={entity.ListSettings?.ItemsPerPage}
            context={context}
            traceContext={ctx} />
        </div>
       }
      <div id="sf-search-results-loading-indicator" style={{display:'none'}}>
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary my-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      {Tracer.endSpan(span)}
    </>
    );
}


async function performSearch(entity: SearchResultsEntity, searchParams: SearchParams, traceContext?: any) {
    let orderByClause = searchParams.orderBy || entity.Sorting;

    if (orderByClause === SearchResultsSorting.NewestFirst) {
        orderByClause = 'PublicationDate desc';
    } else if (orderByClause === SearchResultsSorting.OldestFirst) {
        orderByClause = 'PublicationDate';
    } else {
        orderByClause = '';
    }

    let skip = 0;
    let take = 20;

    let listSettings = entity.ListSettings as ContentListSettings;
    if (listSettings.DisplayMode === ListDisplayMode.Paging) {
        take = listSettings.ItemsPerPage;
        if (searchParams.page) {
            skip = (parseInt(searchParams.page, 10) - 1) * take;
        }
    } else if (listSettings.DisplayMode === ListDisplayMode.Limit) {
        take = listSettings.LimitItemsCount;
    }

    try {
      const searchResults = await RestClient.performSearch({
        indexCatalogue: searchParams.indexCatalogue,
        searchQuery: searchParams.searchQuery,
        wordsMode: searchParams.wordsMode,
        orderBy: orderByClause,
        culture: searchParams['sf_culture'],
        skip: skip,
        take: take,
        searchFields: entity.SearchFields as string,
        highlightedFields: entity.HighlightedFields as string,
        scoringInfo: searchParams.scoringInfo,
        resultsForAllSites: searchParams.resultsForAllSites === 'True',
        filter: searchParams.filter,
        traceContext
      });

      return searchResults;
    } catch (_) {
      return null;
    }
  }
