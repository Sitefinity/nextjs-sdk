import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

export interface SdkItem {
    Provider: string;
    Id: string;
    [key: string]: any;
}

@Model()
export class SdkItemModel {
    @DefaultValue(null)
    Id?: string;

    @DefaultValue(null)
    Provider?: string;
}
