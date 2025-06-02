import { Category, ContentContainer, DataType, Description, DisplayName, KnownFieldTypes, RegularExpression, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

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
