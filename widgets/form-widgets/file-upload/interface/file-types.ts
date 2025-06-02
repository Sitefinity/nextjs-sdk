import { DataType, Model } from '@progress/sitefinity-widget-designers-sdk';

@Model()
export class FileTypes {
    @DataType('string')
    Type?: string;

    @DataType('string')
    Other?: string;
}
