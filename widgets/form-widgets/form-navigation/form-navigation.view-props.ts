import { ViewPropsBase } from '../../common/view-props-base';
import { FormNavigationEntity } from './form-navigation.entity';

export interface FormNavigationViewProps<T extends FormNavigationEntity> extends ViewPropsBase<T> {
    navigationSteps: string[];
    cssClass: string | null;
}
