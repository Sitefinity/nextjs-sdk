
import { StyleGenerator } from '../styling/style-generator.service';
import { SearchResultsViewProps } from './interfaces/search-results.view-props';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { SearchResultsEntity } from './search-results.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { convertToBoolean } from './utils';
import { RenderView } from '../common/render-view';
import { SearchResultsDefaultView } from './search-results.view';
import { RootUrlService } from '../../rest-sdk/root-url.service';

export async function SearchResults(props: WidgetContext<SearchResultsEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const dataAttributes = htmlAttributes(props);
    const entity = props.model.Properties;
    const context = props.requestContext;
    const cultures = context.layout.Site.Cultures;
    const currentPageCultureOrDefault = !!(context?.culture) ? context.culture : 'en';
    const languageNames = new Intl.DisplayNames(currentPageCultureOrDefault, { type: 'language' });

    const languages: {Name: string, Title: string}[] = cultures.map((culture: string) => {
        return {
          Name: culture,
          Title: languageNames.of(culture) || culture
        };
    });

    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const customAttributes = getCustomAttributes(entity.Attributes, 'SearchResults');
    dataAttributes['className'] = classNames(entity.CssClass, marginClass);

    const viewProps: SearchResultsViewProps<SearchResultsEntity>  = {
        languagesLabel: entity.LanguagesLabel,
        resultsNumberLabel: entity.ResultsNumberLabel,
        cssClass: entity.CssClass || undefined,
        languages: languages,
        allowUsersToSortResults: convertToBoolean(entity.AllowUsersToSortResults?.toString()),
        sorting: entity.Sorting.toString(),
        sortByLabel: entity.SortByLabel,
        totalCount: 0,
        webServicePath: `${RootUrlService.getClientCmsUrl()}/${RootUrlService.getSearchWebServicePath()}`,
        webserviceApiKey: props.requestContext.webserviceApiKey,
        attributes: {...dataAttributes, ...customAttributes},
        widgetContext: getMinimumWidgetContext(props)
    };

    entity.ListSettings = entity.ListSettings || { ItemsPerPage: 20, LimitItemsCount: 20, ShowAllResults: false, DisplayMode: ListDisplayMode.All };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <SearchResultsDefaultView {...viewProps}/>
      </RenderView>
    );
}
