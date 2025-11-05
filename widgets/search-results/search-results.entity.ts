import { OffsetStyle } from '../styling/offset-style';
import { ContentListSettings } from '../../editor/widget-framework/content-list-settings';
import { SearchResultsSorting } from './interfaces/search-results-sorting';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { Model, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk';

@Model()
export class ExtendedContentListSettings extends ContentListSettings {
    DisplayMode: ListDisplayMode = ListDisplayMode.All;

    ShowAllResults: boolean = false;
}

@WidgetEntity('SitefinitySearchResults', 'Search results')
export class SearchResultsEntity {

    @DataType('resultsListSettings')
    @DataModel(ExtendedContentListSettings)
    @ContentSection(ContentSectionTitles.ResultsListSettings, 1)
    @DisplayName('Number of list items')
    ListSettings: ExtendedContentListSettings | null = null;

    @ContentSection(ContentSectionTitles.ResultsListSettings, 2)
    @DefaultValue(SearchResultsSorting.MostRelevantOnTop)
    @DisplayName('Sort results')
    @DataType(KnownFieldTypes.Choices)
    @Choice([
        { Title: 'Most relevant on top', Value: SearchResultsSorting.MostRelevantOnTop },
        { Title: 'Newest first', Value: SearchResultsSorting.NewestFirst },
        { Title: 'Oldest first', Value: SearchResultsSorting.OldestFirst }
    ])
    Sorting: SearchResultsSorting = SearchResultsSorting.MostRelevantOnTop;

    @ContentSection(ContentSectionTitles.ResultsListSettings, 3)
    @DisplayName('Allow users to sort results')
    @DataType(KnownFieldTypes.ChipChoice)
    @DefaultValue(1)
    @Choice({ Choices: [
            { Name: 'Yes', Value: 1},
            { Name: 'No', Value: 0}
        ]
    })
    AllowUsersToSortResults: boolean = true;

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @ViewSelector([{ Title: 'Default', Name: 'Default', Value: 'Default', Icon: null }])
    @DisplayName('Search results template')
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings, 2)
    @DisplayName('Margins')
    @DataModel(OffsetStyle)
    @TableView('Search results')
    Margins: OffsetStyle | null = null;

    // Advanced
    @WidgetLabel()
    @Category('Advanced')
    SfWidgetLabel?: string = 'Search results';

    @Category('Advanced')
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category('Advanced')
    @DisplayName('Search fields')
    @Description('List of fields to be used in the search results. These fields must be included in the search index. If left empty, all fields from the search index will be used.')
    SearchFields: string | null = null;

    @Category('Advanced')
    @DisplayName('Additional results fields')
    @Description('List of additional fields to be used in the search results, besides the default ones. These fields must be included in the search index. Use asterisk (*) to include all fields from the index.')
    AdditionalResultFields: string  = '';

    @Category('Advanced')
    @DisplayName('Highlighted fields')
    @Description('List of fields to be highlighted in the search results. These fields must be included in the search index. If left empty, all search fields will be highlighted.')
    HighlightedFields: string | null = null;

    @Category('Advanced')
    @ContentSection('Labels and messages', 0)
    @DisplayName('Search results header')
    @DefaultValue('Results for \"{0}\"')
    SearchResultsHeader: string | null = null;

    @Category('Advanced')
    @ContentSection('Labels and messages', 0)
    @DisplayName('No results header')
    @DefaultValue('No search results for \"{0}\"')
    NoResultsHeader: string | null = null;

    @Category('Advanced')
    @ContentSection('Labels and messages', 0)
    @DisplayName('Results number label')
    @DefaultValue('results')
    ResultsNumberLabel: string | null = null;

    @Category('Advanced')
    @ContentSection('Labels and messages', 0)
    @DisplayName('Languages label')
    @DefaultValue('Show results in')
    @Browsable(false)
    LanguagesLabel: string | null = null;

    @Category('Advanced')
    @ContentSection('Labels and messages', 0)
    @DisplayName('Sort by label')
    @DefaultValue('Sort by')
    SortByLabel: string | null = null;

    @Attributes('SearchResults', 'Search results', 0)
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
