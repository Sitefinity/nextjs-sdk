import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';


@Model()
export class NumericRange {
    @DefaultValue(null)
    @DataType('number')
    Min?: number;

    @DefaultValue(null)
    @DataType('number')
    Max?: number;
}
