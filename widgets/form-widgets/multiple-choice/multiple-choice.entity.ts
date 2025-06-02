import { Choice, ContentSection, ContentSectionTitles, DataType, DefaultValue, DisplayName, Group, KnownFieldTypes, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';
import { ChoiceEntityBase } from '../interfaces/choice-entity-base';

@WidgetEntity('SitefinityMultipleChoice', 'Multiple choice')
export class MultipleChoiceEntity extends ChoiceEntityBase {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @DisplayName('Add "Other" as a last choice (expanding a text box)')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    HasAdditionalChoice: boolean = false;

    @ContentSection(ContentSectionTitles.DisplaySettings, 2)
    @DataType(KnownFieldTypes.Choices)
    @DisplayName('Layout')
    @DefaultValue(1)
    @Choice({Choices: [
        {'Title':'One column','Name':'1','Value':1},
        {'Title':'Two columns','Name':'2','Value':2},
        {'Title':'Three columns','Name':'3','Value':3},
        {'Title':'Side by side','Name':'0','Value':0}]
    })
    ColumnsNumber: number = 1;
}
