import { SelectionMode } from './selection-modes';
import { MixedContentContext } from '../../../editor/widget-framework/mixed-content-context';
import { FIELD_SIZE_OPTIONS, FieldSize } from '../../styling/field-size';
import { ClassificationSettings } from '../../common/classification-settings';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Group } from '@progress/sitefinity-widget-designers-sdk/decorators/group';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

@WidgetEntity('SitefinityDynamicList', 'Dynamic list')
export class DynamicListEntity {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('Select a choice')
    Label: string | null = 'Untitled';

    @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
    @DisplayName('Instructional text')
    @Description('Suitable for giving examples how the entered value will be used.')
    InstructionalText: string | null = null;

    @Category('Advanced')
    @ContentSection('AdvancedMain')
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 3)
    @DisplayName('List type')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice([{ Value: 'Content' }, { Value: 'Classification' }])
    ListType: SelectionMode = SelectionMode.Content;

    @Content()
    @DisplayName('')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @ConditionalVisibility('{"conditions":[{"fieldName":"ListType","operator":"Equals","value":"Content"}]}')
    SelectedContent: MixedContentContext | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 8)
    @DisplayName('Required field')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Required: boolean = false;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 8)
    @DisplayName('Hide field initially (use form rules to display it)')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Hidden: boolean = false;

    @DisplayName('Error message if choice is not selected')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 9)
    @DefaultValue('{0} field is required')
    @ConditionalVisibility('{"conditions":[{"fieldName":"Required","operator":"Equals","value":true}]}')
    RequiredErrorMessage: string | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 5)
    @DisplayName('Sort items')
    @DefaultValue('PublicationDate DESC')
    @DataType('dynamicChoicePerItemType')
    @Choice({ ServiceUrl: '/Default.Sorters()?frontend=True' })
    @ConditionalVisibility('{"conditions":[{"fieldName":"ListType","operator":"Equals","value":"Content"}]}')
    OrderByContent: string | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @Placeholder('Select classification')
    @DisplayName('Classification')
    @DataType('taxonSelector')
    @DataModel(ClassificationSettings)
    @Required('Please select a classification')
    @ConditionalVisibility('{"conditions":[{"fieldName":"ListType","operator":"Equals","value":"Classification"}]}')
    ClassificationSettings: ClassificationSettings | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 5)
    @DisplayName('Sort items')
    @DefaultValue('Title ASC')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '{0}/Default.Sorters()?frontend=True', ServiceCallParameters: '[{ "taxaUrl" : "{0}"}]' })
    @ConditionalVisibility('{"conditions":[{"fieldName":"ListType","operator":"Equals","value":"Classification"}]}')
    OrderBy: string | null = null;

    @Category('Advanced')
    @DisplayName('Sort expression')
    @Description('Custom sort expression, used if default sorting is not suitable.')
    SortExpression: string | null = null;

    @ViewSelector([{ Value: 'Checkboxes' }, { Value: 'Dropdown' }])
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DefaultValue('Dropdown')
    @DisplayName('Template')
    SfViewName: string = 'Dropdown';

    @ContentSection(ContentSectionTitles.DisplaySettings, 2)
    @DisplayName('Field size')
    @DataType(KnownFieldTypes.ChipChoice)
    @DefaultValue('None')
    @Choice(FIELD_SIZE_OPTIONS)
    FieldSize: FieldSize = FieldSize.None;

    @ContentSection(ContentSectionTitles.DisplaySettings, 3)
    @DataType(KnownFieldTypes.Choices)
    @ConditionalVisibility('{"conditions":[{"fieldName":"SfViewName","operator":"Equals","value":"Checkboxes"}]}')
    @DisplayName('Layout')
    @DefaultValue(1)
    @Choice({
        Choices: [
            { 'Title': 'One column', 'Name': '1', 'Value': 1 },
            { 'Title': 'Two columns', 'Name': '2', 'Value': 2 },
            { 'Title': 'Three columns', 'Name': '3', 'Value': 3 },
            { 'Title': 'Side by side', 'Name': '0', 'Value': 0 }
        ]
    })
    ColumnsNumber: number = 1;

    @Category('Advanced')
    @ContentSection('AdvancedMain')
    @DisplayName('Value field name')
    @Description('Name of the field that will be used to hold the value of the selection.')
    ValueFieldName: string | null = null;

    @Browsable(false)
    SfFieldType!: string;
    
    @Browsable(false)
    SfFieldName!: string;
}
