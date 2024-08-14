import { NavigationItem } from '../../rest-sdk/dto/navigation-item';
import { Dictionary } from '../../typings/dictionary';
import { ViewPropsBase } from '../common/view-props-base';
import { NavigationEntity } from './navigation.entity';

export interface NavigationViewProps<T extends NavigationEntity> extends ViewPropsBase<T> {
    navCustomAttributes: Dictionary;
    items: NavigationItem[];
}
