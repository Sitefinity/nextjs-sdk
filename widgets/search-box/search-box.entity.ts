import { Attributes, Category, Choice, ComplexType, ConditionalVisibility, Content, ContentSection, ContentSectionTitles, DataModel, DataType, DefaultValue, Description, DisplayName, KeysValues, KnownFieldTypes, Placeholder, Required, TableView, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { OffsetStyle } from '../styling/offset-style';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';

@WidgetEntity('SitefinitySearchBox', 'Search box')
export class SearchBoxEntity {

    @ContentSection('Search setup', 0)
    @DisplayName('Specify content to search in')
    @Placeholder('Select search index')
    @Required('Please select a search index')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetSearchIndexes', ServiceWarningMessage: 'No search indexes have been created.' })
    @Description('[{"Type":1,"Chunks":[{"Value":"Use search indexes to define different sets","Presentation":[]}, {"Value":"of content visitors can search by using the","Presentation":[2]}, {"Value":"internal search of the your site.","Presentation":[2]}]},{"Type":1,"Chunks":[{"Value":"Manage search indexes in","Presentation":[]},{"Value":"Administration > Search indexes","Presentation":[2,3]}]}]')
    SearchIndex: string | null = null;

    @ContentSection('Search setup', 1)
    @DisplayName('Search results page')
    @Content({ Type: RestSdkTypes.Pages, AllowMultipleItemsSelection: false })
    @Description('This is the page where you have dropped the Search results widget.')
    @Required('Please select a search results page')
    SearchResultsPage: MixedContentContext | null = null;

    @DefaultValue(0)
    @ContentSection('Search setup', 2)
    @DisplayName('Display suggestions after typing...')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({ Choices: [{ 'Title': 'Don\'t display suggestions', 'Name': '0', 'Value': 0, 'Icon': 'ban' }, { 'Title': '2', 'Name': '2', 'Value': 2, 'Icon': null }, { 'Title': '3', 'Name': '3', 'Value': 3, 'Icon': null }, { 'Title': '4', 'Name': '4', 'Value': 4, 'Icon': null }], SideLabel: 'characters' })
    SuggestionsTriggerCharCount?: number;

    @ContentSection('Boost search results', 0)
    @DisplayName('Scoring profile')
    @Placeholder('Select scoring')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetScoringProfiles(catalogName=\'{0}\')', ServiceCallParameters: '[{ "catalogName" : "{0}"}]' })
    @Description('Scoring profiles are part of the search index and consist of weighted fields, functions, and parameters. Use scoring profiles to boost search results by customizing the way different fields are ranked. Manage scoring profiles in the Azure portal.')
    ScoringProfile?: string;

    @ContentSection('Boost search results', 1)
    @DisplayName('Scoring parameters')
    @Description('[{"Type":1,"Chunks":[{"Value":"Scoring parameters are part of the scoring","Presentation":[]}, {"Value":"functions within a scorig profile. Add","Presentation":[2]}, {"Value":"scoring parameters to boost content to","Presentation":[2]}, {"Value":"appear higher in the search results by","Presentation":[2]}, {"Value":"specifying the parameter\'s name and","Presentation":[2]}, {"Value":"value.","Presentation":[2]}, {"Value":"Example: ","Presentation":[]}, {"Value":"testparam:tag1","Presentation":[3]}, {"Value":"Manage scoring parameters in the Azure","Presentation":[2]}, {"Value":"portal.","Presentation":[2]}]}]')
    @ConditionalVisibility('{"conditions":[{"fieldName":"ScoringProfile","operator":"NotEquals","value":null}]}')
    @DataType(ComplexType.Enumerable, 'string')
    ScoringParameters?: string[];

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @ViewSelector([{ Title: 'Default', Name: 'Default', Value: 'Default', Icon: null }])
    @DisplayName('Search box template')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DisplayName('Margins')
    @DataModel(OffsetStyle)
    @TableView('Search box')
    Margins: OffsetStyle | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'Search box';

    @Category('Advanced')
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category('Advanced')
    @DisplayName('Suggestion fields')
    @DefaultValue('Title,Content')
    @Description('List the fields to be used in the search suggestions. These fields must be included in the search index.')
    SuggestionFields: string | null = null;

    @Category('Advanced')
    @DisplayName('Search scope')
    @DataType(KnownFieldTypes.Choices)
    @DefaultValue(0)
    @Choice({ Choices: [{ 'Title': 'All sites in the index', 'Name': '1', 'Value': 1, 'Icon': null }, { 'Title': 'Current site only', 'Name': '2', 'Value': 2, 'Icon': null }, { 'Title': 'As set for the system', 'Name': '0', 'Value': 0, 'Icon': 'ban' }], SideLabel: 'characters' })
    @Description('[{"Type":1,"Chunks":[{"Value":"This setting takes effect only if your search index","Presentation":[]}, {"Value":"contains multiple sites. It’s possible to search","Presentation":[2]}, {"Value":"in all of the sites in the index or in the current","Presentation":[2]}, {"Value":"site only.","Presentation":[2]}]},{"Type":1,"Chunks":[{"Value":"To see how this is set for the system, go to","Presentation":[]},{"Value":"Administration > Settings > Advanced > Search","Presentation":[2,3]},{"Value":"and find the setting Search in all sites in an index.","Presentation":[]}]}]')
    ShowResultsForAllIndexedSites: number = 0;

    @Category('Advanced')
    @ContentSection('Labels and messages', 0)
    @DisplayName('Search box placeholder text')
    @DefaultValue('Search...')
    SearchBoxPlaceholder: string | null = 'Search...';

    @Category('Advanced')
    @ContentSection('Labels and messages', 1)
    @DisplayName('Search button')
    @DefaultValue('Search')
    SearchButtonLabel: string | null = 'Search';

    @Attributes('SearchBox', 'Search box', 0)
    @ContentSection('Attributes', 0)
    @Category('Advanced')
    @DataModel(KeysValues)
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
