import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';


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
