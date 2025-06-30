import { Attributes, Category, Choice,ConditionalVisibility, ContentSection, ContentSectionTitles, DataModel, DataType, DefaultValue, Description, DescriptionExtended, DisplayName, KnownFieldTypes, Margins, MediaItem, Required, SdkItemModel, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { OffsetStyle } from '../styling/offset-style';
import { ImageClickAction, ImageClickActionChoices } from './interfaces/image-click-action';
import { ImageDisplayChoices, ImageDisplayMode } from './interfaces/image-display-mode';
import { CustomSizeModel } from './interfaces/custom-size-model';
import { LinkModel } from '../../editor/widget-framework/link-model';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';
import { ThumbnailItem } from '../../rest-sdk/dto/thumbnail-item';

@WidgetEntity('SitefinityImage', 'Image')
export class ImageEntity {
    @MediaItem('images', false, true)
    @DataType('media')
    @DisplayName('')
    @DefaultValue(null)
    @DataModel(SdkItemModel)
    Item?: SdkItem;

    @DescriptionExtended({ InlineDescription: '(for current page)' })
    @DataType('string')
    @DefaultValue(null)
    Title?: string;

    @DisplayName('Alternative text')
    @DescriptionExtended({ InlineDescription: '(for current page)' })
    @DefaultValue(null)
    @DataType('string')
    AlternativeText?: string;

    @DisplayName('When image is clicked...')
    @Choice(ImageClickActionChoices)
    ClickAction: ImageClickAction = ImageClickAction.DoNothing;

    @DisplayName('Link to...')
    @ConditionalVisibility('{"conditions":[{"fieldName":"ClickAction","operator":"Equals","value":"OpenLink"}]}')
    @Required('Please select a link')
    @DataType('linkSelector')
    @DefaultValue(null)
    ActionLink?: LinkModel;

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DisplayName('Image size')
    @Choice(ImageDisplayChoices)
    ImageSize: ImageDisplayMode = ImageDisplayMode.Responsive;

    @DisplayName('Fit to container')
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    FitToContainer: boolean = true;

    @DisplayName('')
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @ConditionalVisibility('{"conditions":[{"fieldName":"ImageSize","operator":"Equals","value":"CustomSize"}]}')
    @DataType('customSize')
    @DataModel(CustomSizeModel)
    CustomSize: CustomSizeModel | null = null;

    @DisplayName('Thumbnail')
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @ConditionalVisibility('{"conditions":[{"fieldName":"ImageSize","operator":"Equals","value":"Thumbnail"}]}')
    @DataType('thumbnail')
    @DataModel(ThumbnailItem)
    Thumnail: ThumbnailItem | null = null;

    @DisplayName('Image template')
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @ViewSelector([{ Value: 'Image' }])
    @DefaultValue('Image')
    ViewName?: string;

    @Margins('Image')
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    Margins?: OffsetStyle | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'Image';

    @Category('Advanced')
    @DisplayName('CSS class')
    @DataType('string')
    @DefaultValue(null)
    CssClass?: string;

    @Attributes('Image')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
