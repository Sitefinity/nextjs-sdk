import { DataType, Model } from '@progress/sitefinity-widget-designers-sdk';

@Model()
export class PrefixOrSuffix {
    @DataType('number')
    choiceValue: number | null = null;

    @DataType('string')
    textValue: string | null = null;
}
