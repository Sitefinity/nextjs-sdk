import { BreadcrumbItem } from '../../rest-sdk/dto/breadcrumb-item';
import { ViewPropsBase } from '../common/view-props-base';
import { BreadcrumbEntity } from './breadcrumb.entity';

export interface BreadcrumbViewProps<T extends BreadcrumbEntity> extends ViewPropsBase<T> {
    items: BreadcrumbItem[];
}
