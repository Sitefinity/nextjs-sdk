import { WidgetEntity, DisplayName, Description, ContentSection, DataType, DecimalPlaces, CustomMetadata, Choice, KnownFieldTypes, DataModel, ChoiceWithText, Group, DefaultValue, ContentSectionTitles, Browsable, ConditionalVisibility, Category, PropertyCategory, ViewSelector, Suffix, RangeLimitation } from '@progress/sitefinity-widget-designers-sdk';
import { NumericRange } from '../common/numeric-range';
import { PrefixOrSuffix } from './interfaces/prefix-or-suffix';

@WidgetEntity('SitefinityNumberField', 'Number')
export class NumberFieldEntity {
	@ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('Untitled')
    Label: string | null = 'Untitled';

	@Description('Suitable for giving examples how the entered value will be used.')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
    @DisplayName('Instructional text')
    InstructionalText: string | null = null;

    @DisplayName('Placeholder text')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 3)
    PlaceholderText: string | null = null;

    @DisplayName('Predefined value')
    @DataType('number')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @DecimalPlaces(10)
    PredefinedValue: number | null = null;

    @Choice({ Choices: [{ 'Title': '- Select -', 'Name': 'none', 'Value': 0 }, { 'Title': 'Prefix', 'Name': 'prefix', 'Value': 1 }, { 'Title': 'Suffix', 'Name': 'suffix', 'Value': 2 }] })
    @ContentSection(ContentSectionTitles.LabelsAndContent, 5)
    @DataType(KnownFieldTypes.DropdownWithText)
    @Description('Used to add text next to the field such as units, currency, etc.')
    @DisplayName('Field prefix or suffix')
    @DataModel(PrefixOrSuffix)
    PrefixOrSuffix: PrefixOrSuffix | null = null;

    @Group('Options')
    @DisplayName('Required field')
    @DataType(KnownFieldTypes.CheckBox)
    @ContentSection(ContentSectionTitles.LabelsAndContent, 6)
    Required: boolean = false;

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

    @DisplayName('Allow decimals')
    @ContentSection(ContentSectionTitles.Limitations, 1)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({Choices: [
            { Name: 'Yes', Value: true },
            { Name: 'No', Value: false }
        ]
    })
    @DefaultValue(false)
    AllowDecimals: boolean = false;

    @ContentSection(ContentSectionTitles.Limitations, 2)
    @DataType('rangeLimitation')
    @RangeLimitation(true, 'Between')
    @DisplayName('Number range')
    @Suffix('value')
    ValueRange: NumericRange | null = null;

    @ContentSection(ContentSectionTitles.Limitations, 3)
    @DisplayName('Error message displayed when the entry is out of range')
	@DefaultValue('Number is out of the allowed range')
    ValueRangeViolationMessage: string = 'Number is out of the allowed range';

	@ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName: string = 'Default';

	@ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Field size')
    @DataType(KnownFieldTypes.ChipChoice)
    @DefaultValue('XS')
    @Choice({
        Choices: [{ Title: 'None', Value: 'None', Tooltip: 'None. Display system default size for this field.' }, { Title: 'XS', Value: 'XS', Tooltip: 'Extra Small. Takes 25% of the container\'s width.' }, { Title: 'S', Value: 'S', Tooltip: 'Small. Takes 50% of the container\'s width.' }, { Title: 'M', Value: 'M', Tooltip: 'Medium. Takes 75% of the container\'s width.' }, { Title: 'L', Value: 'L', Tooltip: 'Large. Takes 100% of the container\'s width.' }],
        ChipMaxThreshold: 5
    })
    FieldSize: string = 'XS';

	@Category(PropertyCategory.Advanced)
    @ContentSection('AdvancedMain', 2)
    @DisplayName('CSS class')
    CssClass: string | null = null;

	@Browsable(false)
    SfFieldType!: string;

    @Browsable(false)
    SfFieldName!: string;
}
