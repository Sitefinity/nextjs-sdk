import { ChoiceEntityBase } from '../interfaces/choice-entity-base';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Group } from '@progress/sitefinity-widget-designers-sdk/decorators/group';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

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
