import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { LanguageSelectorLinkAction } from './interfaces/language-selector-link-action';
import { StyleGenerator } from '../styling/style-generator.service';
import { LanguageSelectorEntity } from './language-selector-entity';
import { LanguageSelectorDefaultView } from './language-selector.view';
import { RenderView } from '../common/render-view';
import { LanguageSelectorViewProps } from './interfaces/language-selector.view-props';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function LanguageSelector(props: WidgetContext<LanguageSelectorEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const properties = props.model.Properties;
    const dataAttributes = htmlAttributes(props);
    const defaultClass = properties.CssClass;
    const marginClass = properties.Margins && StyleGenerator.getMarginClasses(properties.Margins);
    dataAttributes['className'] = classNames(defaultClass, marginClass, 'qu-dropdown-selector', 'dropdown d-flex');

    const customAttributes = getCustomAttributes(properties.Attributes, 'Language selector');

    const context = props.requestContext;
    const cultures = context.layout.Site.Cultures;
    const layoutId = context.layout.Id;
    let pageItems: PageItem[] = [];
    let languages: LanguageEntry[] = [];

    if (!props.requestContext.url.includes('Sitefinity/Template')) {
        const allBatches = cultures.map((culture: string) => {
            return RestClient.getItem({
                type: RestSdkTypes.Pages,
                id: layoutId,
                culture: culture
            });
        });

        pageItems = await Promise.all(allBatches);

        const languageNames = new Intl.DisplayNames(['en'], {
            type: 'language'
        });

        const homePageId = (await RestClient.getCurrentSite()).HomePageId;
        for (let index = 0; index < cultures.length; index++) {
            const culture = cultures[index];
            const pageUrl = pageItems[index] ? pageItems[index].ViewUrl : '';
            const queryParamsString = getPreservedQueryParamsString(pageUrl, context.searchParams);
            const isTranslated = pageItems[index] ? pageItems[index].AvailableLanguages.includes(culture) && !pageItems[index].ViewUrl.includes('sfaction=preview') : false;
            let localizaedHomePageUrl = '/';

            if (!isTranslated && properties.LanguageSelectorLinkAction === LanguageSelectorLinkAction.RedirectToHomePage) {
                const localizedHomePage = await RestClient.getItem<PageItem>({
                    type: RestSdkTypes.Pages,
                    id: homePageId,
                    traceContext: ctx,
                    culture: culture
                });
                localizaedHomePageUrl = localizedHomePage?.ViewUrl.replace('&sfaction=preview', '');
            }

            const entry: LanguageEntry = {
                Name: languageNames.of(culture) || culture,
                Value: culture,
                Selected: culture === context.layout.Culture,
                PageUrl: pageUrl ? `${pageUrl}${queryParamsString}` : '',
                IsTranslated: isTranslated,
                LocalizedHomePageUrl: localizaedHomePageUrl
            };

            languages.push(entry);
        }
    }

    const viewProps: LanguageSelectorViewProps<LanguageSelectorEntity> = {
        languages: languages,
        languageSelectorLinkAction: props.model.Properties.LanguageSelectorLinkAction,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={properties.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <LanguageSelectorDefaultView {...viewProps} />
      </RenderView>
    );
}

function getPreservedQueryParamsString(pageUrl: string, searchParams: { [key: string]: string }) {
    let queryParams = new URLSearchParams();
    const questionmarkIndex = pageUrl.indexOf('?');
    if (questionmarkIndex > -1) {
        queryParams = new URLSearchParams(pageUrl.substring(questionmarkIndex));
        pageUrl = pageUrl.substring(0, questionmarkIndex);
    }

    Object.keys(searchParams).forEach(queryParamName => {
        queryParams.set(queryParamName, searchParams[queryParamName]);
    });

    const queryParamsString = queryParams.size > 0 ? `?${queryParams.toString()}` : '';

    return queryParamsString;
}

export interface LanguageEntry {
    Name: string;
    Value: string;
    Selected: boolean;
    PageUrl: string;
    LocalizedHomePageUrl: string;
    IsTranslated: boolean;
}
