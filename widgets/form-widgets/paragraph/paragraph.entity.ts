import { Category, Choice, ConditionalVisibility, ContentSection, ContentSectionTitles, DataModel, DataType, DefaultValue, Description, DisplayName, Group, KnownFieldTypes, Suffix, ViewSelector, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';
import { FIELD_SIZE_OPTIONS, FieldSize } from '../../styling/field-size';
import { NumericRange } from '../common/numeric-range';

@WidgetEntity('SitefinityParagraph', 'Paragraph')
export class ParagraphEntity {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('Untitled')
    Label: string | null = 'Untitled';

    @Description('Suitable for giving examples how the entered value will be used.')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
    @DisplayName('Instructional text')
    InstructionalText: string | null = null;

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

    SfFieldType!: string;
    SfFieldName!: string;
}
