import { WidgetEntity, DisplayName, Description, ContentSection, DataType, Choice, KnownFieldTypes, Group, DefaultValue, ContentSectionTitles, Browsable, ConditionalVisibility, Category, PropertyCategory, ViewSelector } from '@progress/sitefinity-widget-designers-sdk';
import { DateFieldType } from './interfaces/date-field-type';

@WidgetEntity('SitefinityDateTimeField', 'Date and time')
export class DateTimeFieldEntity {
	@ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    @DefaultValue('Untitled')
    Label: string | null = 'Untitled';

    @DisplayName('Instructional text')
	@Description('Suitable for giving examples how the entered value will be used.')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
    InstructionalText: string | null = null;

    @DisplayName('Display')
    @Description('This property can only be set initially. Saving the form makes the property read-only.')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 3)
    @DataType(KnownFieldTypes.Choices)
    @Choice([{ Title: 'Date', Value: DateFieldType.DateOnly}, { Title: 'Date and time', Value: DateFieldType.DateTime}, { Title: 'Time', Value: DateFieldType.TimeOnly}])
    FieldType: DateFieldType = DateFieldType.DateOnly;

    @Group('Options')
    @DisplayName('Required field')
    @DataType(KnownFieldTypes.CheckBox)
    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    Required: boolean = false;

	@ContentSection(ContentSectionTitles.LabelsAndContent, 5)
    @DisplayName('Hide field initially (use form rules to display it)')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Hidden: boolean | null = false;

	@DisplayName('Error message if the field is empty')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 6)
    @DefaultValue('{0} field is required')
    @ConditionalVisibility('{"conditions":[{"fieldName":"Required","operator":"Equals","value":true}]}')
    RequiredErrorMessage: string | null = null;

	@ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName: string = 'Default';

	@Category(PropertyCategory.Advanced)
    @ContentSection('AdvancedMain', 2)
    @DisplayName('CSS class')
    CssClass: string | null = null;

	@Browsable(false)
    SfFieldType!: string;

    @Browsable(false)
    SfFieldName!: string;
}
