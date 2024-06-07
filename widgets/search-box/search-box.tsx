import { StyleGenerator } from '../styling/style-generator.service';
import { StylingConfig } from '../styling/styling-config';
import { VisibilityStyle } from '../styling/visibility-style';
import { SearchBoxClient } from './search-box-client';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { SearchBoxEntity } from './search-box.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { SearchBoxViewModel } from './search-box-viewmodel';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function SearchBox(props: WidgetContext<SearchBoxEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const requestContext = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames('position-relative', defaultClass, marginClass);

    let scoringProfile = {
        ScoringSetting: entity.ScoringProfile || '',
        ScoringParameters: entity.ScoringParameters?.length ? entity.ScoringParameters.join(';') : ''
    };

    let searchResultsPageUrl: string | null = null;
    if (entity.SearchResultsPage) {
        const searchResultsPage = await RestClientForContext.getItem<PageItem>(entity.SearchResultsPage, { type: RestSdkTypes.Pages, traceContext: ctx });
        if (searchResultsPage) {
            searchResultsPageUrl = searchResultsPage['ViewUrl'];
        }
    }

    const searchModel: SearchBoxViewModel = {
        ActiveClass: StylingConfig.ActiveClass,
        Attributes: entity.Attributes,
        Culture: requestContext.culture,
        ScoringProfile: scoringProfile,
        SuggestionsTriggerCharCount: entity.SuggestionsTriggerCharCount || 0,
        SearchBoxPlaceholder: entity.SearchBoxPlaceholder,
        SearchButtonLabel: entity.SearchButtonLabel,
        SearchIndex: entity.SearchIndex,
        WebServicePath: `${RootUrlService.getClientServiceUrl()}/`,
        SiteId: requestContext.layout.SiteId,
        SuggestionFields: entity.SuggestionFields,
        SearchResultsPageUrl: searchResultsPageUrl,
        VisibilityClassHidden: StylingConfig.VisibilityClasses[VisibilityStyle.Hidden],
        SearchAutocompleteItemClass: StylingConfig.SearchAutocompleteItemClass,
        ShowResultsForAllIndexedSites: entity.ShowResultsForAllIndexedSites || 0,
        IsEdit: requestContext.isEdit,
        Sort: requestContext.searchParams['orderby'],
        SearchQuery: requestContext.searchParams['searchQuery']
    };

    return (
      <>
        <div {...dataAttributes}>
          { entity.SearchIndex && <SearchBoxClient searchModel={searchModel} />}
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}

