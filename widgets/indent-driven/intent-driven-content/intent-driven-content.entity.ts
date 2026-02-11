import { Choice, DataType, DisplayName, KnownFieldTypes, WidgetEntity, Model, DataModel, ComplexType, TableView, Description, ContentSection, DefaultValue, ConditionalVisibility, Required, ContentSectionTitles, ViewSelector, Category, WidgetLabel, PropertyCategory, StringLength } from '@progress/sitefinity-widget-designers-sdk';
import { SectionType } from './section-type';
import { OffsetStyle } from '../../styling/offset-style';

export interface SectionDto {
    sectionType?: SectionType;
    cssClassName?: string;
}

@Model()
class Section implements SectionDto {
    @Choice([
        { Name: 'Page title and summary', Value: SectionType.TitleAndSummary },
        { Name: 'Rich Text', Value: SectionType.RichText },
        { Name: 'FAQ', Value: SectionType.FAQ },
        { Name: 'Hero', Value: SectionType.Hero },
        { Name: 'Content items - list', Value: SectionType.ContentList },
        { Name: 'Content items - cards', Value: SectionType.ContentListCards }
    ])
    @DisplayName(' ')
    sectionType?: SectionType;
}

export enum NoIntentAction {
    None = 'None',
    GenerateWithPredefinedQuery = 'GenerateWithPredefinedQuery'
}

@WidgetEntity('SitefinityIntentDrivenContent')
export class IntentDrivenContentEntity {
    @DataModel(Section)
    @DataType(ComplexType.Enumerable)
    @DisplayName('Generated content contains..')
    @Description('Specify the content structure. The components (title and summary, rich text, FAQ, etc.) will be filled with content from your site — contextually assembled or generated. If an element isn’t relevant to the user’s intent, it won’t be generated.')
    @TableView({ Reorderable: true, HideRowsIfEmpty: true })
    @ContentSection('Content setup', 1)
    SectionsConfiguration: SectionDto[] = [];

    @ContentSection('Content setup', 3)
    @DisplayName('When no intent is provided...')
    @Choice([
        { 'Name': 'Display nothing', 'Title': 'Display nothing', 'Value': NoIntentAction.None },
        { 'Name': 'Generate content for the following intent...', 'Title': 'Generate content for the following intent...', 'Value': NoIntentAction.GenerateWithPredefinedQuery }
    ])
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue(NoIntentAction.None)
    NoProvidedIntent: NoIntentAction = NoIntentAction.None;

    @DisplayName('')
    @ContentSection('Content setup', 5)
    @ConditionalVisibility({conditions:[{fieldName:'NoProvidedIntent',operator:'Equals',value: NoIntentAction.GenerateWithPredefinedQuery}]})
    @Required()
    @StringLength(1024, 'The default query cannot exceed 1024 characters.')
    DefaultQuery: string | null = null;

    @ViewSelector()
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DisplayName('Intent-driven content template')
    SfViewName: string = 'Default';

    @ContentSection('Display settings', 2)
    @DisplayName('Margins')
    @DataModel(OffsetStyle)
    @TableView('Content block')
    Margins: OffsetStyle | null = null;

    @WidgetLabel()
    @DefaultValue('Intent Driven Content Widget')
    SfWidgetLabel: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Intent-driven content')
    ContentCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Page title and summary')
    PageTitleAndSummaryCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Section title and summary')
    SectionTitleAndSummaryCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Rich Text')
    RichTextCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Content items - list')
    ContentItemsListCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Content items - cards')
    ContentItemsCardsCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('Hero')
    HeroCssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Custom CSS classes')
    @DisplayName('FAQ')
    FaqCssClass: string = '';
}
