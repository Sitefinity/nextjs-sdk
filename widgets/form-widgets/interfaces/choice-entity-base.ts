import { ChoiceOption, ChoiceOptionModel } from '../common/choice-option';
import { ComplexType, ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Group } from '@progress/sitefinity-widget-designers-sdk/decorators/group';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Model, SectionsOrder } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

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
      Choices: ChoiceOption[] | null = [{ Name: 'First choice', Value: '1' }, { Name: 'Second choice', Value: '2' }, { Name: 'Third choice', Value: '3' }];

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

      @Browsable(false)
      SfFieldType?: string;

      @Browsable(false)
      SfFieldName?: string;
}
