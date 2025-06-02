
import { OffsetStyle } from '../styling/offset-style';
import { LinkModel } from '../../editor/widget-framework/link-model';
import { Attributes, Category, ComplexType, ContentSection, ContentSectionTitles, DataModel, DataType, DescriptionExtended, DisplayName, KeysValues, LengthDependsOn, TableView, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { ButtonStyle } from './button-style';
import { AlignmentStyle } from './alignment-style';

@WidgetEntity('SitefinityButton', 'Call to action')
export class CallToActionEntity {
    @DisplayName('Action label')
    @ContentSection('Primary action', 1)
    @DescriptionExtended({InstructionalNotes: 'Example: Learn more'})
    PrimaryActionLabel?: string;

    @DisplayName('Action link')
    @ContentSection('Primary action', 2)
    @DataType('linkSelector')
    PrimaryActionLink?: LinkModel;

    @DisplayName('Action label')
    @ContentSection('Secondary action', 1)
    @DescriptionExtended({InstructionalNotes: 'Example: Learn more'})
    SecondaryActionLabel?: string;

    @DisplayName('Action link')
    @ContentSection('Secondary action', 2)
    @DataType('linkSelector')
    SecondaryActionLink?: LinkModel;

    @DataType(ComplexType.Dictionary)
    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DataModel(ButtonStyle)
    @LengthDependsOn({ ExtraRecords: '[{\"Name\": \"Primary\", \"Title\": \"Primary\"}, {\"Name\": \"Secondary\", \"Title\": \"Secondary\"}]', DisplayName: '', DisplayTitle: '', PropertyName: null})
    Style?: { [key: string]: ButtonStyle };

    @DataType(ComplexType.Dictionary)
    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DataModel(AlignmentStyle)
    @LengthDependsOn({ ExtraRecords: '[{\"Name\": \"CTA\", \"Title\": \"CTA\"}]', DisplayName: '', DisplayTitle: '', PropertyName: null })
    Position?: { [key: string]: AlignmentStyle };

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @DisplayName('Margins')
    @DataModel(OffsetStyle)
    @TableView('CTA')
    Margins: OffsetStyle | null = null;

    @WidgetLabel()
    SfWidgetLabel: string = 'Call to action';

    @Category('Advanced')
    @DisplayName('CSS class')
    CssClass?: string;

    @Attributes({ ExtraRecords: '[{"Name": "Wrapper", "Title": "Wrapper"},{"Name": "Primary", "Title": "Primary"},{"Name": "Secondary", "Title": "Secondary"}]', DisplayName: '', DisplayTitle: ' ', PropertyName: null})
    @ContentSection('Attributes')
    @Category('Advanced')
    @DataModel(KeysValues)
    Attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null = null;
}
