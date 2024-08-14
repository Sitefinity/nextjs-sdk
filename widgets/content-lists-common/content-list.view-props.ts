import { CollectionResponse } from '../../rest-sdk/dto/collection-response';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';
import { ViewPropsBase } from '../common/view-props-base';
import { ContentListEntityBase } from './content-lists-base.entity';

export interface ContentLisMasterProps<T extends ContentListEntityBase> extends ViewPropsBase<T> {
    detailPageUrl?: string;
    items: CollectionResponse<SdkItem>,
    fieldCssClassMap: { [key: string]: string };
    fieldMap: { [key: string]: string };
    viewName: 'CardsList' | 'ListWithImage' | 'ListWithSummary';
}

export interface ContentListMasterViewProps<T extends ContentListEntityBase> extends ViewPropsBase<T> {
    detailPageUrl?: string,
    items: {
        Original: SdkItem,
        [key: string]: any
    }[]
}

export interface ContentListDetailProps<T extends ContentListEntityBase> extends ViewPropsBase<T> {
    viewName: string;
    detailItem: {
        Id: string;
        ProviderName: string;
        ItemType: string;
    }
}

export interface ContentListDetailViewProps<T extends ContentListEntityBase> extends ViewPropsBase<T> {
    detailItem: SdkItem,
}
