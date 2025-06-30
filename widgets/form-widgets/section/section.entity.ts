import { Category, DataType, DisplayName, LengthDependsOn, WidgetEntity, Range } from '@progress/sitefinity-widget-designers-sdk';

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
