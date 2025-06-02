import { DataType, DefaultValue, Model } from '@progress/sitefinity-widget-designers-sdk';

@Model()
export class NumericRange {
    @DefaultValue(null)
    @DataType('number')
    Min?: number;

    @DefaultValue(null)
    @DataType('number')
    Max?: number;
}
