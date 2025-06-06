import { OffsetStyle } from '../styling/offset-style';
import { ClassificationSettings } from '../common/classification-settings';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';

@WidgetEntity('SitefinityClassification', 'Classification')
export class ClassificationEntity {
    @ContentSection('Select classification to display', 0)
    @DisplayName('Classification')
    @DataType('taxonSelector')
    @DataModel(ClassificationSettings)
    @Required('Please select a classification')
    @Placeholder('Select classification')
    ClassificationSettings: ClassificationSettings | null = null;

    // List settings
    @ContentSection('List settings', 0)
    @Choice({
        ServiceUrl: '{0}/Default.Sorters()?frontend=True',
        ServiceCallParameters: '[{ \u0022taxaUrl\u0022 : \u0022{0}\u0022}]'
    })
    @DisplayName('Sort items')
    @DataType(KnownFieldTypes.Choices)
    OrderBy: string = 'Title ASC';

    @ContentSection('List settings', 1)
    @DisplayName('Display item count')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({Choices: [
            { Name: 'Yes', Value: 'True'},
            { Name: 'No', Value: 'False'}
        ]
    })
    ShowItemCount: boolean = true;

    @ContentSection('List settings', 2)
    @DisplayName('Display empty tags or categories')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice({Choices: [
            { Name: 'Yes', Value: 'True'},
            { Name: 'No', Value: 'False'}
        ]
    })
    ShowEmpty: boolean = false;

    // Display settings
    @ContentSection('Display settings')
    @DisplayName('Classification template')
    @ViewSelector([
        { Value: 'Default'}
    ])
    SfViewName: string = 'Default';

    @ContentSection('Display settings', 1)
    @Margins('Classification')
    Margins: OffsetStyle | null = null;

    // Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Classification';

    @Category('Advanced')
    @DataType('string')
    @DisplayName('CSS class')
    CssClass: string | null = null;

    @Category('Advanced')
    @DisplayName('Sort expression')
    @DataType('string')
    @Description('Custom sort expression, used if default sorting options are not suitable.')
    SortExpression: string | null = null;

    @Attributes('Classification')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
