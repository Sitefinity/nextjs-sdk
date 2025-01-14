import { Attributes, Category, Choice,ContentSection, DataModel, DataType, Description, DisplayName, KnownFieldTypes, Margins, Model, Placeholder, Required, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { OffsetStyle } from '../styling/offset-style';
import { ClassificationSettings } from '../common/classification-settings';

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
