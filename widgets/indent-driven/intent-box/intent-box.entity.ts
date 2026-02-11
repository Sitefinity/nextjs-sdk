import { WidgetEntity, DisplayName, DataType, ContentSection, WidgetLabel, DefaultValue, Description, Content, KnownContentTypes, Choice, ConditionalVisibility, KnownFieldTypes, TableView, PropertyCategory, Category, ContentSectionTitles, DataModel, ComplexType, ViewSelector } from '@progress/sitefinity-widget-designers-sdk';
import { MixedContentContext } from '@progress/sitefinity-nextjs-sdk';
import { OffsetStyle } from '../../styling/offset-style';

export enum AfterIntentAction {
    Stay = 'stay',
    Redirect = 'redirect'
}

@WidgetEntity('SitefinityIntentBox')
export class IntentBoxEntity {
    @DisplayName('After Intent is submitted...')
    @Description('Make sure the selected page contains the Intent-driven content widget.')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([{'Title': 'Stay on the same page','Value': AfterIntentAction.Stay},{'Title':'Redirect to page...','Value': AfterIntentAction.Redirect}])
    @DefaultValue(AfterIntentAction.Stay)
    AfterIntentIsSubmitted: AfterIntentAction = AfterIntentAction.Stay;
    
    @DisplayName('')
    @Content({
        Type: KnownContentTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility({
        conditions: [
            {fieldName: 'AfterIntentIsSubmitted', operator: 'Equals', value: AfterIntentAction.Redirect}
        ],
        inline: true
    })
    @DefaultValue(null)
    TargetPage: MixedContentContext | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'Input With Page Property';

    @DisplayName('Suggestions')
    @TableView({Reorderable: true})
    @DataType(ComplexType.Enumerable, 'string')
    Suggestions: string[] = [];

    @ContentSection(ContentSectionTitles.DisplaySettings, 2)
    
    @ViewSelector()
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DisplayName('Intent-driven content template')
    SfViewName: string = 'Default';

    @ContentSection('Display settings', 2)
    @DisplayName('Margins')
    @DataModel(OffsetStyle)
    @TableView('Content block')
    Margins: OffsetStyle | null = null;

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS class')
    CssClass: string = '';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 1)
    @DefaultValue('What are you looking for today?')
    @DisplayName('Label')
    Label: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 2)
    @DefaultValue('Ask for products, rates, or services...   ')
    @DisplayName('Placeholder text')
    PlaceholderText: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 3)
    @DefaultValue('You can ask...')
    @DisplayName('Suggestions label')
    SuggestionsLabel: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 4)
    @DefaultValue('Send')
    @DisplayName('Submit button tooltip')
    SubmitButtonTooltip: string | null = null;
}
