import { CollectionResponse } from '../../rest-sdk/dto/collection-response';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';

export interface ContentListModelMaster {
    DetailPageUrl?: string;
    Items: CollectionResponse<SdkItem>,
    FieldCssClassMap: { [key: string]: string };
    FieldMap: { [key: string]: string };
    ViewName: 'CardsList' | 'ListWithImage' | 'ListWithSummary';
    Attributes: Array<{ Key: string, Value: string }>;
}

export interface ContentListModelDetail {
    ViewName: string;
    DetailItem: {
        Id: string;
        ProviderName: string;
        ItemType: string;
    },
    Attributes: Array<{ Key: string, Value: string}>;
}

export interface DetailViewModel {
    ViewName: string;
    DetailItem: SdkItem,
    Attributes: { [key: string]: string };
    Culture?: string;
}
