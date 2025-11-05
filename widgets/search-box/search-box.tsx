import { StyleGenerator } from '../styling/style-generator.service';
import { StylingConfig } from '../styling/styling-config';
import { VisibilityStyle } from '../styling/visibility-style';
import { SearchBoxClient } from './search-box-client';
import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { SearchBoxEntity } from './search-box.entity';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { SearchBoxViewProps } from './search-box.view-props';
import { RenderView } from '../common/render-view';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function SearchBox(props: WidgetContext<SearchBoxEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const requestContext = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames('position-relative', defaultClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'SearchBox');

    let scoringProfile = {
        scoringSetting: entity.ScoringProfile || '',
        scoringParameters: entity.ScoringParameters?.length ? entity.ScoringParameters.join(';') : ''
    };

    let searchResultsPageUrl: string | null = null;
    if (entity.SearchResultsPage?.Content?.length && entity.SearchResultsPage.Content[0].Variations?.length) {
        try {
            const searchResultsPage = await RestClientForContext.getItem<PageItem>(entity.SearchResultsPage, { type: RestSdkTypes.Pages, culture: requestContext.culture, traceContext: ctx });
            if (searchResultsPage) {
                searchResultsPageUrl = searchResultsPage['ViewUrl'];
            }

        } catch (error) {/* empty */}
    }

    const viewProps: SearchBoxViewProps<SearchBoxEntity> = {
        activeClass: StylingConfig.ActiveClass,
        culture: requestContext.culture,
        scoringProfile: scoringProfile,
        suggestionsTriggerCharCount: entity.SuggestionsTriggerCharCount || 0,
        searchBoxPlaceholder: entity.SearchBoxPlaceholder,
        searchButtonLabel: entity.SearchButtonLabel,
        searchIndex: entity.SearchIndex,
        webServicePath: `${RootUrlService.getClientCmsUrl()}/${RootUrlService.getSearchWebServicePath()}/`,
        siteId: requestContext.layout.SiteId,
        suggestionFields: entity.SuggestionFields,
        searchResultsPageUrl: searchResultsPageUrl,
        visibilityClassHidden: StylingConfig.VisibilityClasses[VisibilityStyle.Hidden],
        searchAutocompleteItemClass: StylingConfig.SearchAutocompleteItemClass,
        showResultsForAllIndexedSites: entity.ShowResultsForAllIndexedSites || 0,
        isEdit: requestContext.isEdit,
        webserviceApiKey: requestContext.webserviceApiKey,
        attributes: {...dataAttributes, ...customAttributes},
        widgetContext: getMinimumWidgetContext(props)
    };

    const viewName = props.model.Properties.SfViewName;

    return (
      <RenderView
        viewName={viewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        { entity.SearchIndex && <SearchBoxClient {...viewProps} />}
        { !entity.SearchIndex && <div {...viewProps.attributes} />}
      </RenderView>
    );
}

