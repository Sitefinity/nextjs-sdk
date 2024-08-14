
import { SdkItem } from '../../../../rest-sdk/dto/sdk-item';
import { ContentListMasterViewProps } from '../../../content-lists-common/content-list.view-props';
import { ContentListEntityBase } from '../../../content-lists-common/content-lists-base.entity';

export interface ListWithSummaryViewProps<T extends ContentListEntityBase> extends ContentListMasterViewProps<T> {
    items: Array<ListWithSummaryItemModel>,
}

export interface ListWithSummaryItemModel {
    PublicationDate: {
        Css: string;
        Value: string;
    },
    Title: {
        Value: string,
        Css: string,
        Link: string
    },
    Text: {
        Value: string,
        Css: string
    },

    Original: SdkItem
}
