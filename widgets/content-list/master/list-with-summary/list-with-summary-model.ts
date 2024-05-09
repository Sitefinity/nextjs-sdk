
import { SdkItem } from '../../../../rest-sdk/dto/sdk-item';
import { ContentListModelbase } from '../content-list-model-base';

export interface ListWithSummaryModel extends ContentListModelbase {
    Items: Array<ListWithSummaryItemModel>,
    Culture?: string;
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
