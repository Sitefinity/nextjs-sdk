import { ChoiceViewPropsBase } from '../../interfaces/choice-view-props-base';
import { MultipleChoiceEntity } from '../multiple-choice.entity';

export interface MultipleChoiceViewProps<T extends MultipleChoiceEntity> extends ChoiceViewPropsBase<T> {
    hasAdditionalChoice: boolean;
}
