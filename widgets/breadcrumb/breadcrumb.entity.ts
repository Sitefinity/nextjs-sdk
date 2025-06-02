import { Attributes, Category, Choice, ConditionalVisibility, Content, ContentSection, DataModel, DataType, DefaultValue, DisplayName, Group, KnownFieldTypes, TableView, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { OffsetStyle } from '../styling/offset-style';
import { BreadcrumbIncludeOption } from './breadcrumb';

@WidgetEntity('SitefinityBreadcrumb', 'Breadcrumb')
export class BreadcrumbEntity {
    // @ContentSection('Breadcrumb setup', 0)
    @DisplayName('')
    @DefaultValue(null)
    @Content({
        Type: 'Telerik.Sitefinity.Pages.Model.PageNode',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022BreadcrumbIncludeOption\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022SpecificPagePath\u0022}],\u0022inline\u0022:\u0022true\u0022}')
    SelectedPage?: MixedContentContext;

    @DisplayName('Include in the breadcrumb...')
    @ContentSection('Breadcrumb setup', 0)
    @DataType(KnownFieldTypes.RadioChoice)
    @DefaultValue(BreadcrumbIncludeOption.CurrentPageFullPath)
    @Choice([
        { Title: 'Full path to the current page',  Value: 'CurrentPageFullPath'},
        { Title: 'Path starting from a specific page...', Value: 'SpecificPagePath'}
    ])
    BreadcrumbIncludeOption?: BreadcrumbIncludeOption;

    @DisplayName('Home page link')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    @ContentSection('Breadcrumb setup', 0)
    @Group('Display...')
    AddHomePageLinkAtBeginning?: boolean;

    @DisplayName('Current page in the end of the breadcrumb')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.CheckBox)
    @ContentSection('Breadcrumb setup', 0)
    @Group('Display...')
    AddCurrentPageLinkAtTheEnd?: boolean;

    @DisplayName('Group pages in the breadcrumb')
    @DefaultValue(false)
    @DataType(KnownFieldTypes.CheckBox)
    @ContentSection('Breadcrumb setup', 0)
    @Group('Display...')
    IncludeGroupPages?: boolean;

    @DisplayName('Detail items in the breadcrumb')
    @DefaultValue(false)
    @DataType(KnownFieldTypes.CheckBox)
    @ContentSection('Breadcrumb setup', 0)
    @Group('Display...')
    AllowVirtualNodes?: boolean;

    @ContentSection('Display settings', 1)
    @DisplayName('Breadcrumb template')
    @DefaultValue('Default')
    @ViewSelector([{Value: 'Default'}])
    SfViewName?: string;

    @ContentSection('Display settings', 2)
    @DisplayName('Margins')
    @DefaultValue(null)
    @DataModel(OffsetStyle)
    @TableView('Breadcrumb')
    Margins?: OffsetStyle;

    // Advanced
    @WidgetLabel()
    @Category('Advanced')
    SfWidgetLabel?: string = 'Breadcrumb';

    @Category('Advanced')
    @DisplayName('CSS class')
    @DataType('string')
    @DefaultValue(null)
    WrapperCssClass?: string;

    @ContentSection('Attributes', 1)
    @Attributes('Breadcrumb')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
