import { OffsetStyle } from '../styling/offset-style';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { ComplexType, ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';

const SetupSectionName = 'AI ask box setup';

@WidgetEntity('SitefinityAskBox', 'AI ask box')
export class AskBoxEntity {
    @ContentSection(SetupSectionName, 0)
    @DisplayName('Agentic RAG connection')
    @Description('[{"Type":1,"Chunks":[{"Value":"A connection to a specific knowledge box in Progress Agentic RAG. Select which connection this widget should use to search and answer questions.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Manage connections in ","Presentation":[]},{"Value":"Administration > Progress Agentic RAG connections","Presentation":[3]}]}]')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetConfiguredKnowledgeBoxes()', ServiceWarningMessage: 'No Agentic RAG connections are found.' })
    @Placeholder('Select connection')
    KnowledgeBoxName: string | null = null;

    @ContentSection(SetupSectionName, 1)
    @DisplayName('Search configuration')
    @Description('[{"Type":1,"Chunks":[{"Value":"A saved set of search settings that the AI uses to find content.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Can be found in Progress Agentic RAG portal ","Presentation":[]},{"Value":"Search > Saved configurations","Presentation":[3]}]}]')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetSearchConfigurations(knowledgeBoxName=\'{0}\')', ServiceCallParameters: '[{ "knowledgeBoxName" : "{0}"}]' })
    ConfigurationName: string | null = null;

    @ContentSection(SetupSectionName, 2)
    @DisplayName('After search is submitted...')
    @Description('This is the page where you have dropped the AI answer and/or AI results widgets.')
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue('stay')
    @Choice([
        { Title: 'Stay on the same page', Name: 'stay', Value: 'stay' },
        { Title: 'Redirect to page...', Name: 'redirect', Value: 'redirect' }
    ])
    RedirectPageMode: string = 'stay';

    @ContentSection(SetupSectionName, 3)
    @DisplayName('')
    @Content({ Type: RestSdkTypes.Pages, AllowMultipleItemsSelection: false })
    @ConditionalVisibility('{"conditions":[{"fieldName":"RedirectPageMode","operator":"Equals","value":"redirect"}],"inline":"true"}')
    @Required('Please select a search results page')
    SearchResultsPage: MixedContentContext | null = null;

    @ContentSection(SetupSectionName, 4)
    @DisplayName('Suggestions')
    @Description('Suggestions are example questions or phrases displayed under the AI ask box.')
    @TableView({ Reorderable: true })
    @DataType(ComplexType.Enumerable, 'string')
    Suggestions: string[] = [];

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @ViewSelector([{ Title: 'Default', Name: 'Default', Value: 'Default', Icon: null }])
    @DisplayName('AI ask box template')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @Margins('AI ask box')
    Margins?: OffsetStyle;

    @WidgetLabel()
    SfWidgetLabel: string = 'AI ask box';

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 0)
    @DisplayName('AI ask box placeholder text')
    @DefaultValue('Search...')
    Placeholder: string = 'Search...';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 1)
    @DisplayName('Submit button label')
    @DefaultValue('Search')
    ButtonLabel: string = 'Search';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Suggestions label')
    @DefaultValue('Try searching for:')
    SuggestionsLabel: string = 'Try searching for:';

    @Attributes('AskBox', 'AI ask box', 0)
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
