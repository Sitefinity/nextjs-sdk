
import { OffsetStyle } from '../styling/offset-style';
import { PageTitleMode } from '../content-lists-common/page-title-mode';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { ContentListEntityBase } from '../content-lists-common/content-lists-base.entity';
import { PagerMode } from '../common/page-mode';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { ContentListSettings } from '../../editor/widget-framework/content-list-settings';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { PagerViewModel } from '../pager/pager-view-model';
import { SectionsOrder, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { CssFieldMappings } from '@progress/sitefinity-widget-designers-sdk/decorators/css-field-mappings';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { FallbackToDefaultValueWhenEmpty } from '@progress/sitefinity-widget-designers-sdk/decorators/fallback-to-default-when-empty';

export const documentListViewMeta = {
    'DocumentList': [
        {
            'fieldTitle': 'Document list',
            'fieldType': 'ShortText'
        },
        {
            'fieldTitle': 'Details view',
            'fieldType': 'ShortText'
        }
    ],
    'DocumentTable': [
        {
            'fieldTitle': 'Document table',
            'fieldType': 'ShortText'
        },
        {
            'fieldTitle': 'Details view',
            'fieldType': 'ShortText'
        }
    ]
};

@WidgetEntity('SitefinityDocumentList', 'Document list')
@SectionsOrder([ContentSectionTitles.SelectDocumentsToDisplay, ContentSectionTitles.ListSettings, ContentSectionTitles.SingleItemSettings, ContentSectionTitles.DisplaySettings, '', ContentSectionTitles.CustomCssClasses, ContentSectionTitles.LabelsAndMessages, ContentSectionTitles.MetadataFields, ContentSectionTitles.Attributes])
export class DocumentListEntity implements ContentListEntityBase {
    // Content section
    @Content({Type: 'Telerik.Sitefinity.Libraries.Model.Document', IsFilterable: true})
    @DisplayName('')
    @ContentSection('Select documents to display', 0)
    SelectedItems: MixedContentContext | null = null;

    @DisplayName('List template')
    @ContentSection('Display settings', 0)
    @ViewSelector([
            { Title: 'Document list', Value: 'DocumentList'},
            { Title: 'Document table', Value: 'DocumentTable'}
        ])
    SfViewName: string = 'DocumentList';

    // List setting section
    @DisplayName('Number of list items')
    @ContentSection('List settings', 0)
    @DataType('listSettings')
    ListSettings: ContentListSettings | null = null;

    @DisplayName('Sort items')
    @ContentSection('List settings', 1)
    @DataType('dynamicChoicePerItemType')
    @Choice({ ServiceUrl: '/Default.Sorters()?frontend=True' })
    OrderBy: string = 'PublicationDate DESC';

    // Single item settings
    @DisplayName('Open single item in...')
    @ContentSection('Single item settings', 0)
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'Auto-generated page - same layout as the list page',  Value: DetailPageSelectionMode.SamePage},
        { Title: 'Select existing page', Value: DetailPageSelectionMode.ExistingPage}
    ])
    DetailPageMode: DetailPageSelectionMode = DetailPageSelectionMode.SamePage;

    @DisplayName('Single item template')
    @ContentSection('Display settings', 1)
    @ViewSelector([
            {Title: 'Details.Document details', Value: 'Details.DocumentDetails'}
        ])
    SfDetailViewName: string = 'Details.DocumentDetails';

    @ContentSection('Display settings', 2)
    @Margins('Document list')
    @DataModel(OffsetStyle)
    Margins: OffsetStyle | null = null;

    @ContentSection('Single item settings', 1)
    @DisplayName('')
    @Content({
        Type: 'Telerik.Sitefinity.Pages.Model.PageNode',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022DetailPageMode\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022ExistingPage\u0022}],\u0022inline\u0022:\u0022true\u0022}')
    DetailPage: MixedContentContext | null = null;

    // Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Document list';

    @Category('Advanced')
    @ContentSection('', 1)
    @DisplayName('Document view display mode')
    @DataType(KnownFieldTypes.Choices)
    @Choice([
        { Value: ContentViewDisplayMode.Automatic },
        { Value: ContentViewDisplayMode.Master },
        { Value: ContentViewDisplayMode.Detail }
    ])
    @Description('[{\u0022Type\u0022:1,\u0022Chunks\u0022:[{\u0022Value\u0022:\u0022Based on your selection the items will be\u0022,\u0022Presentation\u0022:[]},{\u0022Value\u0022:\u0022displayed as follows:\u0022,\u0022Presentation\u0022:[2]}]},{\u0022Type\u0022:1,\u0022Chunks\u0022:[{\u0022Value\u0022:\u0022Automatic\u0022,\u0022Presentation\u0022:[0]},{\u0022Value\u0022:\u0022- handles detail item urls like\u0022,\u0022Presentation\u0022:[]},{\u0022Value\u0022:\u0022page/2021/01/01/documents.\u0022,\u0022Presentation\u0022:[2]}]},{\u0022Type\u0022:1,\u0022Chunks\u0022:[{\u0022Value\u0022:\u0022Master\u0022,\u0022Presentation\u0022:[0]},{\u0022Value\u0022:\u0022 - as a list that does not handle\u0022,\u0022Presentation\u0022:[]},{\u0022Value\u0022:\u0022detail item urls.\u0022,\u0022Presentation\u0022:[2]},{\u0022Value\u0022:\u0022E.g. page/2021/01/01/documents will throw 404.\u0022,\u0022Presentation\u0022:[2]}]},{\u0022Type\u0022:1,\u0022Chunks\u0022:[{\u0022Value\u0022:\u0022Detail\u0022,\u0022Presentation\u0022:[0]},{\u0022Value\u0022:\u0022- shows a selected item in detail\u0022,\u0022Presentation\u0022:[]},{\u0022Value\u0022:\u0022mode only.\u0022,\u0022Presentation\u0022:[2]}]}]')
    ContentViewDisplayMode: ContentViewDisplayMode = ContentViewDisplayMode.Automatic;

    @Category('Advanced')
    @ContentSection('', 2)
    @DisplayName('Selection group logical operator')
    @DataType(KnownFieldTypes.ChipChoice)
    @Description('Controls the logic of the filters - whether all conditions should be true (AND) or whether one of the conditions should be true (OR).')
    @Choice([
        { Value: 'AND'},
        { Value: 'OR'}
    ])
    SelectionGroupLogicalOperator: 'AND' | 'OR' = 'AND';

    @Category('Advanced')
    @ContentSection('', 3)
    @DisplayName('Filter expression')
    @DataType('string')
    @Description('Custom filter expression added to already selected filters.')
    FilterExpression: any = null;

    @Category('Advanced')
    @ContentSection('', 4)
    @DisplayName('Sort expression')
    @Description('Custom sort expression, used if default sorting is not suitable.')
    SortExpression: string = 'PublicationDate DESC';

    @Category('Advanced')
    @ContentSection('', 6)
    @DisplayName('Disable canonical URL meta tag')
    @Description('Disables the canonocal URL generation on widget level.')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({Choices: [{'Title':'Yes','Name':'Yes','Value':'True'},{'Title':'No','Name':'No','Value':'False'}]})
    DisableCanonicalUrlMetaTag: boolean = false;

    @Category('Advanced')
    @ContentSection('', 7)
    @DisplayName('Paging mode')
    @DataType(KnownFieldTypes.RadioChoice)
    @Description('Controls whether the paging works with URL segments or a query parameter.')
    @Choice([
        { Value: 'URLSegments', Title: 'URL segments'},
        { Value: 'QueryParameter', Title: 'Query parameter'}
    ])
    PagerMode: PagerMode = PagerMode.URLSegments;

    @Category('Advanced')
    @ContentSection('', 8)
    @DisplayName('Template for paging URL segments')
    @Description('Template for the URL segments the widget\u0027s paging will work with. Use {{pageNumber}} for the current page number.')
    @FallbackToDefaultValueWhenEmpty()
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022PagerMode\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022URLSegments\u0022}]}')
    PagerTemplate: string = PagerViewModel.PageNumberDefaultTemplate;

    @Category('Advanced')
    @ContentSection('', 9)
    @DisplayName('Template for paging query parameter')
    @Description('Template for the query parameter the widget\u0027s paging will work with.')
    @FallbackToDefaultValueWhenEmpty()
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022PagerMode\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022QueryParameter\u0022}]}')
    PagerQueryTemplate: string = 'page';

    // Custom CSS classes
    @Category('Advanced')
    @ContentSection('Custom CSS classes', 0)
    @DisplayName('')
    @CssFieldMappings(documentListViewMeta, false)
    CssClasses: Array<{ FieldName: string; CssClass: string; }> | null = null;

    @Attributes('Document list', 'Document list')
    Attributes: { [key: string]: Array<{ Key: string; Value: string; }>; } | null = null;

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Download link label')
    DownloadLinkLabel: string = 'Download';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Title column label')
    TitleColumnLabel: string = 'Title';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Type column label')
    TypeColumnLabel: string = 'Type';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages, 2)
    @DisplayName('Size column label')
    SizeColumnLabel: string = 'Size';

    // Metadata fields
    @Category('Advanced')
    @ContentSection('Metadata fields', 0)
    @DisplayName('SEO enabled')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({
        Choices: [
            { Name: 'Yes', Value: 'True' },
            { Name: 'No', Value: 'False' }
        ]
    })
    SeoEnabled: boolean = true;

    @Category('Advanced')
    @ContentSection('Metadata fields', 1)
    @DisplayName('Meta title')
    @DataType('string')
    MetaTitle: string | null = null;

    @Category('Advanced')
    @ContentSection('Metadata fields', 2)
    @DisplayName('Meta description')
    @DataType('string')
    MetaDescription: string | null = null;

    @Category('Advanced')
    @ContentSection('Metadata fields', 3)
    @DisplayName('Page title mode')
    @Description('[{\u0022Type\u0022: 1,\u0022Chunks\u0022: [{\u0022Value\u0022: \u0022Setting Page title mode\u0022,\u0022Presentation\u0022: [0]},{\u0022Value\u0022: \u0022Replace \u2013 page title is replaced by the\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022item\u0027s title.\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022Append \u2013 item title is appended to the\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022page title.\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022Hierarchy \u2013 page title will be built by the\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022item\u0027s title and its parent\u0027s title. Value is\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022relevant for the Forums widget only.\u0022,\u0022Presentation\u0022: [2]},{\u0022Value\u0022: \u0022Do not set \u2013 page title will not be altered.\u0022,\u0022Presentation\u0022: []}]}]')
    @DataType(KnownFieldTypes.Choices)
    @Choice([
        { Value: PageTitleMode.Replace },
        { Value: PageTitleMode.Append },
        { Value: PageTitleMode.Hierarchy },
        { Value: PageTitleMode.DoNotSet, Title: 'Do not set' }
    ])
    PageTitleMode: PageTitleMode =  PageTitleMode.Replace;

    @Category('Advanced')
    @ContentSection('Metadata fields', 4)
    @DisplayName('OpenGraph enabled')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({
        Choices: [
            { Name: 'Yes', Value: 'True' },
            { Name: 'No', Value: 'False' }
        ]
    })
    OpenGraphEnabled: boolean = true;

    @Category('Advanced')
    @ContentSection('Metadata fields', 5)
    @DisplayName('OpenGraph title')
    @DataType('string')
    OpenGraphTitle: string | null = null;

    @Category('Advanced')
    @ContentSection('Metadata fields', 6)
    @DisplayName('OpenGraph description')
    @DataType('string')
    OpenGraphDescription: string | null = null;

    @Category('Advanced')
    @ContentSection('Metadata fields', 7)
    @DisplayName('OpenGraph image')
    @DataType('string')
    OpenGraphImage: string | null = null;

    @Category('Advanced')
    @ContentSection('Metadata fields', 8)
    @DisplayName('OpenGraph video')
    @DataType('string')
    OpenGraphVideo: string | null = null;

    @Category('Advanced')
    @ContentSection('Metadata fields', 9)
    @DisplayName('OpenGraph type')
    @DataType('string')
    OpenGraphType: string | null = 'website';
}

