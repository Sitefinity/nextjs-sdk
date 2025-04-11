import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Range } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';

@WidgetEntity('SitefinitySection', 'Section')
export class FormSectionEntity {

    @Range(1, 12, 'Column\u0027s count must be between 1 and 12.')
    @Category('QuickEdit')
    ColumnsCount: number = 1;

    @Category('QuickEdit')
    CssSystemGridSize: number = 12;

    @Category('QuickEdit')
    @DisplayName('Proportions')
    @LengthDependsOn('ColumnsCount', 'Column', 'Column')
    @DataType('enumerable', 'string')
    ColumnProportionsInfo: string[] | null = null;
}
