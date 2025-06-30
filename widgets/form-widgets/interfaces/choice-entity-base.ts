import { Category, ComplexType, ConditionalVisibility, ContentSection, ContentSectionTitles, DataModel, DataType, DefaultValue, Description, DisplayName, Group, KnownFieldTypes, Model, Placeholder, PropertyCategory, RegularExpression, Required, SectionsOrder, TableView, ViewSelector } from '@progress/sitefinity-widget-designers-sdk';
import { ChoiceOption, ChoiceOptionModel } from '../common/choice-option';

@Model()
@SectionsOrder([ContentSectionTitles.LabelsAndContent, ContentSectionTitles.DisplaySettings])
export class ChoiceEntityBase {
      @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
      @DisplayName('Label or question')
      @DataType(KnownFieldTypes.TextArea)
      Label: string | null = 'Select a choice';

      @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
      @DisplayName('Instructional text')
      @Description('Suitable for giving examples how the entered value will be used.')
      InstructionalText: string | null = null;

      @ContentSection(ContentSectionTitles.LabelsAndContent, 3)
      @TableView({ Selectable: true, Reorderable: true })
      @DataType(ComplexType.Enumerable)
      @DataModel(ChoiceOptionModel)
      Choices: ChoiceOption[] | null = null;

      @ContentSection(ContentSectionTitles.LabelsAndContent, 5)
      @DisplayName('Required field')
      @DataType(KnownFieldTypes.CheckBox)
      @Group('Options')
      Required: boolean = false;

      @ContentSection(ContentSectionTitles.LabelsAndContent, 6)
      @DisplayName('Hide field initially (use form rules to display it)')
      @DataType(KnownFieldTypes.CheckBox)
      @Group('Options')
      Hidden: boolean = false;

      @ContentSection(ContentSectionTitles.LabelsAndContent, 7)
      @DisplayName('Error message if choice is not selected')
      @DefaultValue('{0} field is required')
      @ConditionalVisibility('{"conditions":[{"fieldName":"Required","operator":"Equals","value":true}]}')
      RequiredErrorMessage: string = '{0} field is required';

      @ViewSelector([{Value: 'Default'}])
      @ContentSection(ContentSectionTitles.DisplaySettings, 1)
      @DisplayName('Template')
      SfViewName: string | null = 'Default';

      @Category(PropertyCategory.Advanced)
      @ContentSection('AdvancedMain')
      @DisplayName('CSS class')
      CssClass: string | null = null;

      SfFieldType?: string;
      SfFieldName?: string;
}
