
import { OffsetStyle } from '../styling/offset-style';
import { LinkModel } from '../../editor/widget-framework/link-model';
import { ButtonStyle } from './button-style';
import { AlignmentStyle } from './alignment-style';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DescriptionExtended } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { ComplexType, ContentSectionTitles } from '@progress/sitefinity-widget-designers-sdk/common';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Category } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { Attributes, KeysValues } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';

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
