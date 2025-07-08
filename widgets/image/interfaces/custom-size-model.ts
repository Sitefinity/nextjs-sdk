import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

@Model()
export class CustomSizeModel {
    @DataType('number')
    Width?: number;

    @DataType('number')
    Height?: number;

    @DataType('number')
    OriginalWidth?: number;

    @DataType('number')
    OriginalHeight?: number;

    ConstrainToProportions: boolean = true;
}
