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
import { DateTimeFilterValue } from '@progress/sitefinity-widget-designers-sdk';

export function resolveLastModifiedDate(filter: DateTimeFilterValue | null): string {
    if (!filter) {
        return '';
    }

    if (filter.PeriodType === 'last') {
        const now = new Date();
        const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        switch (filter.TimeSpanInterval) {
            case 'days':
                date.setUTCDate(date.getUTCDate() - filter.TimeSpanValue);
                break;
            case 'weeks':
                date.setUTCDate(date.getUTCDate() - filter.TimeSpanValue * 7);
                break;
            case 'months':
                date.setUTCMonth(date.getUTCMonth() - filter.TimeSpanValue);
                break;
            case 'years':
                date.setUTCFullYear(date.getUTCFullYear() - filter.TimeSpanValue);
                break;
            default:
                return '';
        }

        return date.toISOString();
    }

    if (filter.PeriodType === 'period') {
        if (!filter.FromDate) {
            return '';
        }

        const fromDate = new Date(filter.FromDate as unknown as string);
        if (Number.isNaN(fromDate.getTime())) {
            return '';
        }

        return new Date(Date.UTC(
            fromDate.getUTCFullYear(),
            fromDate.getUTCMonth(),
            fromDate.getUTCDate()
        )).toISOString();
    }

    return '';
}

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
        contentTypes: entity.ContentTypes ? entity.ContentTypes.join(',') : '',
        lastModified: resolveLastModifiedDate(entity.ModifiedDateFilter),
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
