import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

@WidgetEntity('SitefinityFormPage', 'Form page')
export class FormPageEntity {
    @DisplayName('Page label')
    @DefaultValue('Step')
    @ContentSection(ContentSectionTitles.LabelsAndContent)
    PageLabel: string = 'Step';

    @DisplayName('Button label')
    @DefaultValue('Next')
    @ContentSection(ContentSectionTitles.LabelsAndContent)
    ButtonLabel: string = 'Next';

    @DisplayName('Allow users to step backward')
    @DefaultValue(true)
    @ContentSection(ContentSectionTitles.LabelsAndContent)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice('[{"Title":"Yes","Name":"Yes","Value":true,"Icon":null},{"Title":"No","Name":"No","Value":false,"Icon":null}]')
    AllowStepBackward: boolean = true;

    @DisplayName('Back link label')
    @DefaultValue('Back')
    @ContentSection(ContentSectionTitles.LabelsAndContent)
    @ConditionalVisibility('{"conditions":[{"fieldName":"AllowStepBackward","operator":"Equals","value":true}]}')
    BackLinkLabel: string = 'Back';

    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName: string = 'Default';

    @Category('Advanced')
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Browsable(false)
    SfFieldType!: string;

    @Browsable(false)
    SfFieldName!: string;
}
