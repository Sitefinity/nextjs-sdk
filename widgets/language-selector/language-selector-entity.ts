import { OffsetStyle } from '../styling/offset-style';
import { LanguageSelectorLinkAction } from './interfaces/language-selector-link-action';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { LanguageSelectorDisplayFormat } from './interfaces/language-selector-language-format';

@WidgetEntity('SitefinityLanguageSelector', 'Language selector')
export class LanguageSelectorEntity {
    @ContentSection('Language selector setup')
    @DisplayName('For languages without translations...')
    @Description('Some pages may not be translated to all languages. This setting defines the language selector behavior when a translation is missing.')
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue(LanguageSelectorLinkAction.HideLink)
    @Choice([
        { Title: 'Hide the link to the missing translation', Value: LanguageSelectorLinkAction.HideLink },
        { Title: 'Redirect to the home page in the language of the missing translation', Value: LanguageSelectorLinkAction.RedirectToHomePage }
    ])
    LanguageSelectorLinkAction: LanguageSelectorLinkAction = LanguageSelectorLinkAction.HideLink;

    @ContentSection('Language selector setup')
    @DisplayName('Show language names...')
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue(LanguageSelectorDisplayFormat.Native)
    @Choice([
        { Title: 'In native language (e.g., français, português)', Value: LanguageSelectorDisplayFormat.Native },
        { Title: 'In native language, capitalized (e.g., Français, Português)', Value: LanguageSelectorDisplayFormat.NativeCapitalized },
        { Title: 'In English (e.g., French, Portuguese)', Value: LanguageSelectorDisplayFormat.English }
    ])
    LanguageSelectorDisplayFormat: LanguageSelectorDisplayFormat = LanguageSelectorDisplayFormat.Native;

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
