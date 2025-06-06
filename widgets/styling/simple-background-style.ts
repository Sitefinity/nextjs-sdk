import { BackgroundBase } from './background-base';
import { StylingConfig } from './styling-config';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ColorPalette } from '@progress/sitefinity-widget-designers-sdk/decorators/color-palette';

@Model()
export class SimpleBackgroundStyle {
    @DisplayName('Type')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice([
            { Value: 'None' },
            { Value: 'Color' }
        ])
    BackgroundType: BackgroundBase = 'None';

    @DisplayName('Value')
    @DataType(KnownFieldTypes.Color)
    @ColorPalette('Default', StylingConfig)
    @ConditionalVisibility(
        {conditions:[{ fieldName:'BackgroundType', operator:'Equals', value:'Color' }]}
    )
    Color: string = '#DCECF5';
}
