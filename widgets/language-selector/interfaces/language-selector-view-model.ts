import { LanguageEntry } from '../language-selector';
import { LanguageSelectorLinkAction } from './language-selector-link-action';

export interface LanguageSelectorViewModel {
    languages: LanguageEntry[];
    languageSelectorLinkAction: LanguageSelectorLinkAction;
    homePageViewUrl: string;
}
