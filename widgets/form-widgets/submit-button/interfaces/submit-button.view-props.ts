import { ViewPropsBase } from '../../../common/view-props-base';
import { SubmitButtonEntity } from '../submit-button.entity';

export interface SubmitButtonViewProps<T extends SubmitButtonEntity> extends ViewPropsBase<T> {
    label: string;
}
