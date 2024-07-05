
import { StyleGenerator } from '../styling/style-generator.service';
import { SearchResultsViewModel } from './interfaces/search-results-viewmodel';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { PagerMode } from '../common/page-mode';
import { getPageNumber } from '../pager/pager-view-model';
import { classNames } from '../../editor/utils/classNames';
import { getUniqueId } from '../../editor/utils/getUniqueId';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { SearchResultsEntity } from './search-results.entity';
import { SearchParams } from './interfaces/search-params';
import { SearchResultsClient } from './search-results-client';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { performSearch, updateSearchResultsHeader, updateViewModel } from './search-results-common';
import { convertToBoolean } from './utils';

export async function SearchResults(props: WidgetContext<SearchResultsEntity>) {
  const {span, ctx} = Tracer.traceWidget(props, true);
    const dataAttributes = htmlAttributes(props);
    const entity = props.model.Properties;

    const context = props.requestContext;
    const searchParams = (context.searchParams as unknown) as SearchParams;

    const cultures = context.layout.Site.Cultures;
    const currentPageCultureOrDefault = !!(context?.culture) ? context.culture : 'en';
    const languageNames = new Intl.DisplayNames(currentPageCultureOrDefault, { type: 'language' });

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
        AllowUsersToSortResults: convertToBoolean(entity.AllowUsersToSortResults?.toString()),
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

    const searchResponse = await performSearch(entity, searchParams, ctx);
    updateViewModel(viewModel, searchResponse);
    updateSearchResultsHeader(entity, viewModel, searchParams);

    const defaultClass =  entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const searchResultsCustomAttributes = getCustomAttributes(entity.Attributes, 'SearchResults');

    dataAttributes['className'] = classNames(defaultClass, marginClass);

    let orderByQuery = searchParams.orderBy;
    let sorting = orderByQuery ? orderByQuery : (viewModel.Sorting || '');
    let sortingSelectId = getUniqueId('sf-sort-');
    const currentPage = getPageNumber(PagerMode.QueryParameter, context);

    return  (context.searchParams.searchQuery || context.isEdit) && (
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
      <SearchResultsClient viewModel={viewModel} searchParams={searchParams} sortingSelectId={sortingSelectId} context={context} sorting={sorting} entity={entity} currentPage={currentPage} ctx={ctx} />
      {Tracer.endSpan(span)}
    </div>
    );
}
