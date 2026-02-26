import { AskBoxEntity } from './ask-box.entity';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { classNames } from '../../editor/utils/classNames';
import { StyleGenerator } from '../styling/style-generator.service';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { AskBoxViewProps } from './ask-box.view-props';
import { StylingConfig } from '../styling/styling-config';
import { VisibilityStyle } from '../styling/visibility-style';
import { RenderView } from '../common/render-view';
import { AskBoxDefaultView } from './ask-box.view';


export async function AskBox(props: WidgetContext<AskBoxEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const requestContext = props.requestContext;
    let dataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(defaultClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'AskBox');

    let searchResultsPageUrl: string | null = null;
    if (entity.RedirectPageMode === 'redirect' && entity.SearchResultsPage?.Content?.length && entity.SearchResultsPage.Content[0].Variations?.length) {
        try {
            const searchResultsPage = await RestClientForContext.getItem<PageItem>(entity.SearchResultsPage, { type: RestSdkTypes.Pages, culture: requestContext.culture, traceContext: ctx });
            if (searchResultsPage) {
                searchResultsPageUrl = searchResultsPage['ViewUrl'];
            }
        } catch (error) {
            /* empty */
        }
    }

    const viewProps: AskBoxViewProps<AskBoxEntity> = {
        knowledgeBoxName: entity.KnowledgeBoxName,
        searchConfigurationName: entity.ConfigurationName,
        resultsPageUrl: searchResultsPageUrl,
        suggestions: JSON.stringify(entity.Suggestions),
        placeholder: entity.Placeholder,
        buttonLabel: entity.ButtonLabel,
        suggestionsLabel: entity.SuggestionsLabel,
        activeClass: StylingConfig.ActiveClass,
        visibilityClassHidden: StylingConfig.VisibilityClasses[VisibilityStyle.Hidden],
        searchAutocompleteItemClass: StylingConfig.SearchAutocompleteItemClass,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    const viewName = props.model.Properties.SfViewName;

    return (
      <RenderView
        viewName={viewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <AskBoxDefaultView {...viewProps} />
      </RenderView>
    );
}
