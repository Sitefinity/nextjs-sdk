import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

@Model()
export class CustomCssModel {
    @DataType('string')
    @DisplayName('CLASS')
    @Placeholder('type CSS class...')
    Class: string | null = null;
}
