import { WidgetEntity, ContentSection, DisplayName, Description, DataType, KnownFieldTypes, DefaultValue, Choice, Margins, WidgetLabel, Category, Attributes, ViewSelector } from '@progress/sitefinity-widget-designers-sdk';
import { OffsetStyle } from '../styling/offset-style';
import { LanguageSelectorLinkAction } from './interfaces/language-selector-link-action';

@WidgetEntity('SitefinityLanguageSelector', 'Language selector')
export class LanguageSelectorEntity {
    @ContentSection('Language selector setup')
    @DisplayName('For languages without translations...')
    @Description('Some pages may not be translated to all languages. This seting defines the language selector behavior when a translation is missing.')
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue(LanguageSelectorLinkAction.HideLink)
    @Choice([
        { Title: 'Hide the link to the missing translation', Value: LanguageSelectorLinkAction.HideLink },
        { Title: 'Redirect to the home page in the language of the missing translation', Value: LanguageSelectorLinkAction.RedirectToHomePage }
    ])
    LanguageSelectorLinkAction: LanguageSelectorLinkAction = LanguageSelectorLinkAction.HideLink;

    @ContentSection('Display settings')
    @DisplayName('Language selector template')
    @ViewSelector()
    SfViewName: string = 'Language selector';

    @ContentSection('Display settings', 1)
    @Margins('Language selector')
    Margins: OffsetStyle | null = null;

    @WidgetLabel()
    @DefaultValue('')
    SfWidgetLabel: string = '';

    @Category('Advanced')
    @DisplayName('CSS class')
    @DataType('string')
    @DefaultValue(null)
    CssClass?: string;

    @Category('Advanced')
    @ContentSection('Attributes', 1)
    @Attributes('Language selector')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string }> };
}
