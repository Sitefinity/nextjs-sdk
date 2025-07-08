import { OffsetStyle } from '../styling/offset-style';
import { FacetField } from './interfaces/facet-field';
import { ComplexType, ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { KeysValues } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';

@WidgetEntity('SitefinityFacets', 'Search facets')
export class SearchFacetsEntity {
    @ContentSection('Search facets setup', 0)
    @DisplayName('Search index')
    @Placeholder('Select search index')
    @Required('Select search index')
    @DataType(KnownFieldTypes.Choices)
    @Choice({
        ServiceUrl: 'Default.GetFacetableIndexes',
        ServiceWarningMessage: 'No search index with facetable fields has been created yet. To manage search indexes, go to Administration > Search indexes, or contact your administrator for assistance.'
    })
    @Description('[{"Type":1,"Chunks":[{"Value":"To display facetable fields on your site,","Presentation":[]},{"Value":"select the same search index as the one","Presentation":[]},{"Value":"selected in the Search box widget.","Presentation":[]}]}]')
    IndexCatalogue: string | null = null;

    @ContentSection('Search facets setup', 0)
    @TableView({Reorderable: true, Selectable: false, MultipleSelect: false})
    @DisplayName('Set facetable fields')
    @ConditionalVisibility('{"conditions":[{"fieldName":"IndexCatalogue","operator":"NotEquals","value":null }]}')
    @DataModel(FacetField)
    @DataType(ComplexType.Enumerable)
    @DefaultValue(null)
    SelectedFacets: FacetField[] = [];

    @ContentSection('Search facets setup', 0)
    @DisplayName('Sort fields')
    @DataType(KnownFieldTypes.Choices)
    @ConditionalVisibility('{"conditions":[{"fieldName":"IndexCatalogue","operator":"NotEquals","value":null }]}')
    @Choice({Choices:[{'Title':'As set manually','Name':'0','Value':0,'Icon':'ban'},{'Title':'Alphabetically','Name':'2','Value':2,'Icon':null}]})
    @DefaultValue(null)
    SortType?: string;

    @ContentSection('Search facets setup', 1)
    @DisplayName('Display item count')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({Choices: [{'Title':'Yes','Name':'Yes','Value':'True','Icon':null},{'Title':'No','Name':'No','Value':'False','Icon':null}]})
    @ConditionalVisibility('{"conditions":[{"fieldName":"IndexCatalogue","operator":"NotEquals","value":null }]}')
    DisplayItemCount: boolean = true;

    @ContentSection('Search facets setup', 1)
    @DisplayName('Collapse large facet lists')
    @DataType( KnownFieldTypes.ChipChoice)
    @Choice({Choices: [{'Title':'Yes','Name':'Yes','Value':'True','Icon':null},{'Title':'No','Name':'No','Value':'False','Icon':null}]})
    @ConditionalVisibility('{"conditions":[{"fieldName":"IndexCatalogue","operator":"NotEquals","value":null }]}')
    @Description('[{"Type":1,"Chunks":[{"Value":"Specifies whether to collapse facet lists on","Presentation":[]}, {"Value":"your site with more than 10 entries. If \'No\'","Presentation":[2]}, {"Value":"is selected, all facets are displayed.","Presentation":[2]}]}]')
    IsShowMoreLessButtonActive: boolean = true;

    @ContentSection(ContentSectionTitles.DisplaySettings, 0)
    @ViewSelector([{Title:'Default', Name: 'Default',Value: 'Default',Icon: null}])
    @DisplayName('Template')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @Margins('Search facets')
    Margins?: OffsetStyle | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'Search facets';

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS class')
    @DataType('string')
    WidgetCssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @DisplayName('Search fields')
    @Description('[{"Type":1,"Chunks":[{"Value":"List of fields to be used in the search facets. These fields must be the same as those specified in the Search results widget.","Presentation":[]}]}]')
    @DataType('string')
    SearchFields?: string | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Search facets header')
    FilterResultsLabel: string | null = 'Filter results';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 1)
    @DisplayName('Search facets label')
    AppliedFiltersLabel: string | null = 'Applied filters';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 2)
    @DisplayName('Clear facets link')
    ClearAllLabel: string | null = 'Clear all';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 3)
    @DisplayName('Show more link')
    ShowMoreLabel: string | null = 'Show more';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 4)
    @DisplayName('Show less link')
    ShowLessLabel: string | null = 'Show less';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.Attributes, 0)
    @DisplayName('Data attributes for...')
    @LengthDependsOn(null, '', '', '[{"Name": "SearchFacets", "Title": "Search facets"}]')
    @DataType(KnownFieldTypes.Attributes)
    @DataModel(KeysValues)
    Attributes: { [key: string]: Array<{ Key: string, Value: string}> } | null = null;
}
