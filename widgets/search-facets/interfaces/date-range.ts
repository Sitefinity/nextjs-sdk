import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { DateSettings } from '@progress/sitefinity-widget-designers-sdk/decorators/date-settings';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';

@Model()
export class DateRange {
    @DisplayName('start date')
    @DateSettings(false)
    @Placeholder('Start date')
    @Required()
    @DataType('datetime')
    @DefaultValue(null)
    From?: Date;

    @DisplayName('end date')
    @DateSettings(false)
    @Placeholder('End date')
    @Required()
    @DataType('datetime')
    @DefaultValue(null)
    To?: Date;

    @DisplayName('label')
    @Placeholder('type label...')
    @Description('Add a label for this range on your site. For example, 2021 - 2022 or May 2022.')
    @Required()
    @DefaultValue('')
    @DataType('string')
    Label?: string;
}
