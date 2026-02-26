import { AnswerEntity } from './answer.entity';
import { ViewPropsBase } from '../common/view-props-base';
import { AnswerCdnUrls } from './answer.view';

export interface AnswerViewProps<T extends AnswerEntity> extends ViewPropsBase<T> {
    title: string;
    assistantAvatarUrl: string | null;
    showSources: boolean;
    notice: string | null;
    showFeedback: boolean | null;
    searchedPhraseLabel: string | null;
    positiveFeedbackTooltip: string;
    negativeFeedbackTooltip: string;
    thankYouMessage: string;
    expandAnswerLabel: string;
    collapseAnswerLabel: string;
    loadingLabel: string;
    cdnUrls: AnswerCdnUrls;
}
