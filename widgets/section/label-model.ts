import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { MaxLength } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

@Model()
export class LabelModel {
    @DataType('string')
    @DisplayName('LABEL')
    @Placeholder('type a label...')
    @MaxLength(30)
    Label: string | null = null;
}
