import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

@Model()
export class FileTypes {
    @DataType('string')
    Type?: string;

    @DataType('string')
    Other?: string;
}
