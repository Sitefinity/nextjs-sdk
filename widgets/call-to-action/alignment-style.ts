import { Choice, DataType, DefaultValue, DisplayName, KnownFieldTypes, Model } from '@progress/sitefinity-widget-designers-sdk';

@Model()
export class AlignmentStyle {
    @DataType(KnownFieldTypes.ChipChoice)
    @DefaultValue('Left')
    @Choice([
        { Value: 'Left', Icon: {'Name': 'align-left','Look': 'size-xs' } as any },
        { Value: 'Center', Icon: {'Name': 'align-center','Look': 'size-xs' } as any },
        { Value: 'Right', Icon: {'Name': 'align-right','Look': 'size-xs' } as any },
        { Value: 'Justify', Icon: {'Name': 'align-justify','Look': 'size-xs' } as any }
    ])
    Alignment: 'Left' | 'Center' | 'Right' | 'Justify' = 'Left';
}
