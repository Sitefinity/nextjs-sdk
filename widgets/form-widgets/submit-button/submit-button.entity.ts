import { Category, ContentSection, ContentSectionTitles, DefaultValue, DisplayName, ViewSelector, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';

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

    SfFieldType!: string;
    SfFieldName!: string;
}
