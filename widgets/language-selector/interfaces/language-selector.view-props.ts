import { ViewPropsBase } from '../../common/view-props-base';
import { LanguageEntry } from '../language-selector';
import { LanguageSelectorEntity } from '../language-selector-entity';
import { LanguageSelectorLinkAction } from './language-selector-link-action';

export interface LanguageSelectorViewProps<T extends LanguageSelectorEntity> extends ViewPropsBase<T> {
    languages: LanguageEntry[];
    languageSelectorLinkAction: LanguageSelectorLinkAction;
}
