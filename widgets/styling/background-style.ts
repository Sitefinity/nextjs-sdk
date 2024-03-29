
import { ImagePosition } from './image-position';
import { Choice,ColorPalette, ConditionalVisibility, DataModel, DataType, DisplayName, KnownFieldTypes, MediaItem, Model, SdkItemModel } from '@progress/sitefinity-widget-designers-sdk';
import { StylingConfig } from './styling-config';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';

@Model()
export class BackgroundStyle {
    @DisplayName('Type')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice([
            { Value: 'None' },
            { Value: 'Color' },
            { Value: 'Image' },
            { Value: 'Video' }
        ])
    BackgroundType: 'None' | 'Color' | 'Image' | 'Video' = 'None';

    @DisplayName('Value')
    @DataType(KnownFieldTypes.Color)
    @ColorPalette('Default', StylingConfig)
    @ConditionalVisibility({
        conditions: [ { fieldName: 'BackgroundType', operator: 'Equals', value: 'Color' } ]
    })
    Color: string = '#DCECF5';

    @DisplayName('Value')
    @MediaItem('images', false)
    @DataType('media')
    @DataModel(SdkItemModel)
    @ConditionalVisibility({
        conditions: [ { fieldName: 'BackgroundType', operator: 'Equals', value: 'Image' } ]
    })
    ImageItem: SdkItem | null = null;

    @DisplayName('Value')
    @MediaItem('videos', false)
    @DataType('media')
    @DataModel(SdkItemModel)
    @ConditionalVisibility({
        conditions: [ { fieldName: 'BackgroundType', operator: 'Equals', value: 'Video' } ]
    })
    VideoItem: SdkItem | null = null;

    @DisplayName(' ')
    @DataType(KnownFieldTypes.Choices)
    @Choice([
            { Value: 'Fill'},
            { Value: 'Center'},
            { Value: 'Cover'}
        ])
    @ConditionalVisibility({
        conditions: [ { fieldName: 'BackgroundType', operator: 'Equals', value: 'Image' } ]
    })
    ImagePosition: ImagePosition = 'Fill';
}
