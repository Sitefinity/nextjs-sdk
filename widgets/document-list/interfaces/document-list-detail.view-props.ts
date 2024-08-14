import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { ViewPropsBase } from '../../common/view-props-base';
import { DocumentListEntity } from '../document-list-entity';

export interface DocumentListDetailViewProps<T extends DocumentListEntity> extends ViewPropsBase<T> {
    viewName: string;
    detailItem: {
        Id: string;
        ProviderName: string;
        ItemType: string;
    };
    item: SdkItem,
    downloadLinkLabel?: string,
    culture?: string
}
