
import { ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

@WidgetEntity('SitefinitySubmitButton', 'Submit Button')
export class SubmitButtonEntity {
    @DefaultValue('Submit')
    @ContentSection(ContentSectionTitles.LabelsAndContent)
    Label?: string;

    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName: string = 'Default';

    @Category('Advanced')
    @DisplayName('CSS class')
    CssClass?: string;

    @Browsable(false)
    SfFieldType!: string;
    
    @Browsable(false)
    SfFieldName!: string;
}
