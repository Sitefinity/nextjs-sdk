import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { OffsetSize } from './offset-size';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { Offset_Choices } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';

@Model()
export class OffsetStyle {
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice(Offset_Choices)
    Top: OffsetSize = 'None';

    @DataType(KnownFieldTypes.ChipChoice)
    @Choice(Offset_Choices)
    Right: OffsetSize = 'None';

    @DataType(KnownFieldTypes.ChipChoice)
    @Choice(Offset_Choices)
    Bottom: OffsetSize = 'None';

    @DataType(KnownFieldTypes.ChipChoice)
    @Choice(Offset_Choices)
    Left: OffsetSize = 'None';
}
