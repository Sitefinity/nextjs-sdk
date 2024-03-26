import { RequestContext } from '../../../editor/request-context';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { ContentListModelDetail, ContentListModelMaster } from '../../content-lists-common/content-list-models';
import { ContentListEntityBase } from '../../content-lists-common/content-lists-base.entity';
import { PagerProps } from '../../pager/pager';

export interface ContentListViewModel {
    detailModel?: ContentListModelDetail | null;
    listModel?: ContentListModelMaster | null;
    entity: ContentListEntityBase;
    pagerProps?: PagerProps;
    requestContext: RequestContext;
}

export interface ContentListModelbase {
    Attributes: {[key: string]: string},
    OpenDetails: boolean,
    Items: {
        Original: SdkItem,
        [key: string]: any
    }[],
    Pager?: {}
}
