
import { SdkItem } from '../../../../rest-sdk/dto/sdk-item';
import { ContentListMasterViewProps } from '../../../content-lists-common/content-list.view-props';
import { ContentListEntityBase } from '../../../content-lists-common/content-lists-base.entity';

export interface CardsListViewProps<T extends ContentListEntityBase> extends ContentListMasterViewProps<T> {
    items: Array<CardItemModel>
}

export interface CardItemModel {
    Image: {
        Css: string;
        Title: string;
        AlternativeText: string;
        Url: string
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
