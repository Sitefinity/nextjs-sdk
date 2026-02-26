import { AskBoxEntity } from './ask-box.entity';
import { ViewPropsBase } from '../common/view-props-base';

export interface AskBoxViewProps<T extends AskBoxEntity> extends ViewPropsBase<T> {
    knowledgeBoxName: string | null;
    searchConfigurationName: string | null;
    resultsPageUrl: string | null;
    suggestions: string;
    placeholder: string;
    buttonLabel: string;
    suggestionsLabel: string;
    activeClass: string;
    visibilityClassHidden: string;
    searchAutocompleteItemClass: string;
}
