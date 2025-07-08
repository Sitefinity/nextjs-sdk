
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ContentContainer } from '@progress/sitefinity-widget-designers-sdk/decorators/content-container';
import { RegularExpression } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
@WidgetEntity('SitefinityFormContentBlock', 'Content block')
export class FormContentBlockEntity {
    @ContentContainer()
    @DataType(KnownFieldTypes.Html)
    Content: string | null = null;

    @Category('Advanced')
    @DisplayName('CSS class')
    @DataType('string')
    WrapperCssClass: string | null = null;

    @Category('Advanced')
    @DisplayName('Tag name')
    @Description('Up to twenty characters in the range a-z and A-Z are allowed')
    @RegularExpression('^[a-zA-Z]{1,20}$', 'Up to twenty characters in the range a-z and A-Z are allowed.')
    TagName: string = 'div';
}
