import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes, htmlAttributes, setWarning } from '../../editor/widget-framework/attributes';
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
import { LanguageSelectorDisplayFormat } from './interfaces/language-selector-language-format';
import { TransferableRequestContext } from '../../editor/request-context';

const PREVIEW_ACTION_QUERY_PARAM_STRING = 'sfaction=preview';

// In legacy MVC pages a Path is used
const PREVIEW_ACTION_PATH_STRING = '/Action/Preview';

export async function LanguageSelector(props: WidgetContext<LanguageSelectorEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const properties = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    const defaultClass = properties.CssClass;
    const marginClass = properties.Margins && StyleGenerator.getMarginClasses(properties.Margins);
    dataAttributes['className'] = classNames(defaultClass, marginClass, 'qu-dropdown-selector', 'dropdown d-flex');
    const context = props.requestContext;

    if (!isPageRequest(props)) {
        setWarning(dataAttributes, 'Language selector is visible when you are on a particular page.');
        return (
          <span {...dataAttributes} />
        );
    }

    const customAttributes = getCustomAttributes(properties.Attributes, 'Language selector');
    const cultures = context.layout.Site.Cultures;
    const currentPageCultures = context.layout.Fields['AvailableLanguages'] ?? cultures;
    const layoutId = context.layout.Id;
    let pageByCulture: { [culture: string]: PageItem } = {};
    let languages: LanguageEntry[] = [];

    const currentPageRequests = currentPageCultures.map((culture: string) => {
        return RestClient.getItem<PageItem>({
            type: RestSdkTypes.Pages,
            id: layoutId,
            culture: culture
        }).then(r => {
            pageByCulture[culture] = r;
        }, (err) => {
            console.error(err);
        });
    });

    await Promise.all(currentPageRequests);

    for (let culture of cultures) {
        const currentCulturePage = pageByCulture[culture];
        const pageUrl = currentCulturePage ? currentCulturePage.ViewUrl : '';
        const isTranslated = currentCulturePage &&
            currentCulturePage.AvailableLanguages.includes(culture) &&
            !currentCulturePage.ViewUrl.includes(PREVIEW_ACTION_QUERY_PARAM_STRING);

        const queryParamsString = getPreservedQueryParamsString(pageUrl, context.searchParams);
        let localizaedHomePageUrl = await getLocalizedHomePageUrl(ctx, properties, isTranslated, culture);
        let detailItemUrlPart = await getDetailItemUrlPart(ctx, context, isTranslated, culture);

        const entry: LanguageEntry = {
            Name: getLanguageName(culture, properties.LanguageSelectorDisplayFormat) || culture,
            Value: culture,
            Selected: culture === context.layout.Culture,
            PageUrl: pageUrl ? `${pageUrl}${detailItemUrlPart}${queryParamsString}` : '',
            IsTranslated: isTranslated,
            LocalizedHomePageUrl: localizaedHomePageUrl
        };

        languages.push(entry);
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

async function getDetailItemUrlPart(traceContext: any, context: TransferableRequestContext, isTranslated: boolean, culture: any) {
    let detailItemUrlPart = '';
    if (isTranslated && context.detailItem) {
        try {
            let detailItemForCulture = await RestClient.getItem({
                type: context.detailItem.ItemType,
                id: context.detailItem.Id,
                culture: culture,
                provider: context.detailItem.ProviderName,
                traceContext: traceContext
            });

            if (detailItemForCulture?.ItemDefaultUrl) {
                detailItemUrlPart = detailItemForCulture.ItemDefaultUrl;
            }
        } catch (error) {
            // Ignore: Item not translated to culture
        }
    }

    return detailItemUrlPart;
}

let homePageId: string;
async function getLocalizedHomePageUrl(traceContext: any, properties: LanguageSelectorEntity, isTranslated: boolean, culture: any) {
    let localizedHomePageUrl = '/';

    if (!isTranslated && properties.LanguageSelectorLinkAction === LanguageSelectorLinkAction.RedirectToHomePage) {
        if (!homePageId) {
            homePageId = (await RestClient.getCurrentSite()).HomePageId;
        }

        const localizedHomePage = await RestClient.getItem<PageItem>({
            type: RestSdkTypes.Pages,
            id: homePageId,
            traceContext: traceContext,
            culture: culture
        });

        if (localizedHomePage.AvailableLanguages.includes(culture) &&
            !localizedHomePage.ViewUrl.includes(PREVIEW_ACTION_QUERY_PARAM_STRING) &&
            !localizedHomePage.ViewUrl.includes(PREVIEW_ACTION_PATH_STRING)) {
            localizedHomePageUrl = localizedHomePage?.ViewUrl;
        }
    }

    return localizedHomePageUrl;
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

function getLanguageName(code: string, format: LanguageSelectorDisplayFormat): string {
    let name: string;
    switch (format) {
        case LanguageSelectorDisplayFormat.English:
            name = new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
            break;

        case LanguageSelectorDisplayFormat.Native:
            name = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
            break;

        case LanguageSelectorDisplayFormat.NativeCapitalized:
            name = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
            name = name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
            break;

        default:
            name = code;
    }

    return name;
}

function isPageRequest(props: WidgetContext<LanguageSelectorEntity>): boolean {
    return !!props.requestContext.layout.Fields;
}

export interface LanguageEntry {
    Name: string;
    Value: string;
    Selected: boolean;
    PageUrl: string;
    LocalizedHomePageUrl: string;
    IsTranslated: boolean;
}
