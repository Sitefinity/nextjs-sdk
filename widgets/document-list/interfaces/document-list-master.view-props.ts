import { ListDisplayMode } from '../../../editor/widget-framework/list-display-mode';
import { CollectionResponse } from '../../../rest-sdk/dto/collection-response';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { ViewPropsBase } from '../../common/view-props-base';
import { PagerProps } from '../../pager/pager';
import { DocumentListEntity } from '../document-list-entity';

export interface DocumentListMasterViewProps<T extends DocumentListEntity> extends ViewPropsBase<T> {
    items: CollectionResponse<SdkItem>;
    sizeColumnLabel?: string;
    titleColumnLabel?: string;
    typeColumnLabel?: string;
    renderLinks?: boolean;
    pagerProps: PagerProps;
    pagerMode: ListDisplayMode;
    url?: string;
    queryString?: string;
    downloadLinkLabel?: string,
}
