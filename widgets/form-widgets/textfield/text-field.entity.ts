import { TextType } from './interfaces/text-type';
import { FIELD_SIZE_OPTIONS, FieldSize } from '../../styling/field-size';
import { NumericRange } from '../common/numeric-range';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Group } from '@progress/sitefinity-widget-designers-sdk/decorators/group';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Suffix } from '@progress/sitefinity-widget-designers-sdk/decorators/suffix';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

@WidgetEntity('SitefinityTextField', 'Textbox')
export class TextFieldEntity {

    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('Untitled')
    Label: string | null = 'Untitled';

    @Description('Suitable for giving examples how the entered value will be used.')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
    @DisplayName('Instructional text')
    InstructionalText: string | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 3)
    @DisplayName('Field type')
    @Choice([{ Title: 'Text', Value: 'Text' }, { Title: 'Email', Value: 'Email' }, { Title: 'Phone', Value: 'Phone' }, { Title: 'URL', Value: 'URL' }])
    @DefaultValue(TextType.Text)
    InputType: TextType = TextType.Text;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @DisplayName('Placeholder text')
    PlaceholderText: string | null = null;

    @DisplayName('Predefined value')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 5)
    PredefinedValue: string | null = null;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 6)
    @DisplayName('Required field')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Required: boolean | null = false;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 7)
    @DisplayName('Hide field initially (use form rules to display it)')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Hidden: boolean | null = false;

    @DisplayName('Error message if the field is empty')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 8)
    @DefaultValue('{0} field is required')
    @ConditionalVisibility('{"conditions":[{"fieldName":"Required","operator":"Equals","value":true}]}')
    RequiredErrorMessage: string | null = null;

    @ContentSection(ContentSectionTitles.Limitations)
    @DataType(KnownFieldTypes.Range)
    @DataModel(NumericRange)
    @Suffix('characters')
    Range: NumericRange | null = null;

    @ContentSection(ContentSectionTitles.Limitations)
    @DisplayName('Error message displayed when the entry is out of range')
    @DefaultValue('{0} field input is too long')
    TextLengthViolationMessage: string | null = null;
    
    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName: string = 'Default';

    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Field size')
    @DataType(KnownFieldTypes.ChipChoice)
    @DefaultValue('None')
    @Choice(FIELD_SIZE_OPTIONS)
    FieldSize: FieldSize = FieldSize.None;

    @Category('Advanced')
    @ContentSection('AdvancedMain', 2)
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category('Advanced')
    @ContentSection('AdvancedMain', 3)
    @DisplayName('Regular expression validation pattern')
    RegularExpression: string | null = null;

    @Category('Advanced')
    @ContentSection('AdvancedMain', 4)
    @DisplayName('Regular expression error message')
    RegularExpressionViolationMessage: string | null = 'Please match the requested format';

    @Browsable(false)
    SfFieldType!: string;
    
    @Browsable(false)
    SfFieldName!: string;
}
