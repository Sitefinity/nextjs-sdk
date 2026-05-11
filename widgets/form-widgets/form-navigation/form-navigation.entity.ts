import { ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

@WidgetEntity('SitefinityFormNavigation', 'Form navigation')
export class FormNavigationEntity {
    @DisplayName('Navigation steps')
    @DataType('formNavigationSteps')
    NavigationSteps: string[] = [];

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
