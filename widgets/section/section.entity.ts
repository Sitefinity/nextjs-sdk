import { BackgroundStyle } from '../styling/background-style';
import { CustomCssModel } from '../styling/custom-css-model';
import { OffsetStyle } from '../styling/offset-style';
import { SimpleBackgroundStyle } from '../styling/simple-background-style';
import { LabelModel } from './label-model';
import { ComplexType } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { RegularExpression, Range } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';

@WidgetEntity('SitefinitySection', 'Section')
export class SectionEntity {
    // Quick edit
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

    // Basic
    @ContentSection('Section style', 0)
    @DisplayName('Padding')
    @DataModel(OffsetStyle)
    @DefaultValue(JSON.stringify({ 'Top': 'S', Bottom: 'S', Left: 'None', Right: 'None' }))
    @TableView('Section')
    SectionPadding: OffsetStyle | null = null;

    @ContentSection('Section style', 1)
    @DisplayName('Margin')
    @DataModel(OffsetStyle)
    @TableView('Section')
    SectionMargin: OffsetStyle | null = null;

    @ContentSection('Section style', 1)
    @DisplayName('Background')
    @DataModel(BackgroundStyle)
    @TableView('Section')
    SectionBackground: BackgroundStyle | null = null;

    // Column style
    @ContentSection('Column style', 0)
    @DisplayName('Padding')
    @LengthDependsOn('ColumnsCount', 'Column', 'Column ')
    @DataModel(OffsetStyle)
    @DataType('dictionary')
    ColumnsPadding: { [key: string]: OffsetStyle } | null = null;

    @ContentSection('Column style', 2)
    @DisplayName('Background')
    @LengthDependsOn('ColumnsCount', 'Column', 'Column ')
    @DataModel(SimpleBackgroundStyle)
    @DataType('dictionary')
    ColumnsBackground: { [key: string]: SimpleBackgroundStyle } | null = null;

    @Category('Advanced')
    @DisplayName('Tag name')
    @Description('Up to twenty characters in the range a-z are allowed')
    @RegularExpression('^[a-zA-Z]{1,20}$', 'Up to twenty characters in the range a-z and A-Z are allowed.')
    TagName: string = 'section';

    @Category('Advanced')
    @ContentSection('Custom CSS classes')
    @DisplayName('Custom CSS class for...')
    @LengthDependsOn('ColumnsCount', 'Column', 'Column ', '[{"Name": "Section", "Title": "Section"}]')
    @DataModel(CustomCssModel)
    @DataType(ComplexType.Dictionary)
    CustomCssClass: { [key: string]: CustomCssModel } | null = null;

    @Category('Advanced')
    @ContentSection('Labels')
    @DisplayName('Section and column labels')
    @Description('Custom labels are displayed in the page editor for your convenience. They do not appear on the public site. You can change the generic name for this section and add column labels in the section widget.')
    @LengthDependsOn('ColumnsCount', 'Column', 'Column ', '[{"Name": "Section", "Title": "Section"}]')
    @DataModel(LabelModel)
    @DataType(ComplexType.Dictionary)
    Labels: { [key: string]: LabelModel } | null = null;

    @Attributes({DisplayName: 'Column', DisplayTitle: 'Column ', PropertyName: 'ColumnsCount', ExtraRecords: '[{\"Name\": \"Section\", \"Title\": \"Section\"}]'})
    Attributes?: { [key: string]: Array<{ Key: string, Value: string }> };
}
