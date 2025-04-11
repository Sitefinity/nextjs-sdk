import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { OffsetStyle } from '../styling/offset-style';
import { ContentContainer } from '@progress/sitefinity-widget-designers-sdk/decorators/content-container';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { RegularExpression } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';

@WidgetEntity('SitefinityContentBlock', 'Content block')
export class ContentBlockEntity {
    @ContentContainer()
    @DataType(KnownFieldTypes.Html)
    Content: string | null = null;

    @DataType('string')
    ProviderName: string | null = null;

    @DataType('uuid')
    SharedContentID: string | null = null;

    //Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Content block';

    @Category('Advanced')
    @DisplayName('CSS class')
    @DataType('string')
    WrapperCssClass: string | null = null;

    @Category('Advanced')
    @DisplayName('Tag name')
    @RegularExpression('^[a-zA-Z]{1,20}$', 'Up to twenty characters in the range a-z and A-Z are allowed.')
    TagName: string = 'div';

    @Category('Advanced')
    @ContentSection('Display settings', 1)
    @DisplayName('Padding')
    @DataModel(OffsetStyle)
    @TableView('Content block')
    Paddings: OffsetStyle | null = null;

    @Category('Advanced')
    @ContentSection('Display settings', 2)
    @DisplayName('Margins')
    @DataModel(OffsetStyle)
    @TableView('Content block')
    Margins: OffsetStyle | null = null;

    @Attributes('ContentBlock', 'Content block', 1)
    Attributes: { [key: string]: Array<{ Key: string; Value: string; }>; } | null = null;
}
