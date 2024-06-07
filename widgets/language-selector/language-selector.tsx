import { classNames } from '../../editor/utils/classNames';
import { getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { LanguageSelectorLinkAction } from './interfaces/language-selector-link-action';
import { StyleGenerator } from '../styling/style-generator.service';
import { RenderWidgetService } from '../../services/render-widget-service';
import { LanguageSelectorEntity } from './language-selector-entity';
import { LanguageSelectorDefaultTemplate } from './language-selector-default-template';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function LanguageSelector(props: WidgetContext<LanguageSelectorEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const properties = props.model.Properties;
    const dataAttributes = htmlAttributes(props);
    const defaultClass = properties.CssClass;
    const marginClass = properties.Margins && StyleGenerator.getMarginClasses(properties.Margins);
    dataAttributes['className'] = classNames(defaultClass, marginClass, 'qu-dropdown-selector', 'dropdown d-flex');

    const languageSelectorCustomAttributes = getCustomAttributes(properties.Attributes, 'Language selector');

    const context = props.requestContext;
    const cultures = context.layout.Site.Cultures;
    const layoutId = context.layout.Id;
    let values: PageItem[] = [];
    let languages: LanguageEntry[] = [];

    if (!props.requestContext.url.includes('Sitefinity/Template')) {
        const allBatches = cultures.map((culture: string) => {
            return RestClient.getItem({
                type: RestSdkTypes.Pages,
                id: layoutId,
                culture: culture
            });
        });

        values = await Promise.all(allBatches);

        const languageNames = new Intl.DisplayNames(['en'], {
            type: 'language'
        });

        languages = cultures.map((culture: string, index: number) => {
            const entry: LanguageEntry = {
                Name: languageNames.of(culture) || culture,
                Value: culture,
                Selected: culture === context.layout.Culture,
                PageUrl: values[index] ? values[index].ViewUrl : '',
                IsTranslated: values[index] ? values[index].AvailableLanguages.includes(culture) : false
            };

            return entry;
        });
    }

    let homePageViewUrl = '/';
    if (properties.LanguageSelectorLinkAction === LanguageSelectorLinkAction.RedirectToHomePage) {
        const homePageId = (await RestClient.getCurrentSite()).HomePageId;
        const homePage = await RestClient.getItem<PageItem>({
            type: RestSdkTypes.Pages,
            id: homePageId,
            traceContext: ctx
        });
        homePageViewUrl = homePage?.ViewUrl;
    }

    const templates = RenderWidgetService.widgetRegistry.widgets['SitefinityLanguageSelector']?.templates;
    const template = (templates && templates[properties.SfViewName](props)) || LanguageSelectorDefaultTemplate;

    return (
      <>
        <div {...dataAttributes} {...languageSelectorCustomAttributes}>
          {template({
            viewModel: {
                languages: languages,
                languageSelectorLinkAction: props.model.Properties.LanguageSelectorLinkAction,
                homePageViewUrl: homePageViewUrl
            }
        })}
        </div>
        {Tracer.endSpan(span)}
      </>
    );
}

export interface LanguageEntry {
    Name: string;
    Value: string;
    Selected: boolean;
    PageUrl: string;
    IsTranslated: boolean;
}
