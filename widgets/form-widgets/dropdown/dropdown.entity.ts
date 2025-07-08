import { ChoiceEntityBase } from '../interfaces/choice-entity-base';
import { FIELD_SIZE_OPTIONS, FieldSize } from '../../styling/field-size';
import { DROPWDOWN_PREDEFINED_LIST } from './dropdown-predefined-list';
import { ChoiceOption } from '../common/choice-option';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { TableView } from '@progress/sitefinity-widget-designers-sdk/decorators/table-view';

export type DropdownSorting = 'Manual' | 'Alphabetical';

@WidgetEntity('SitefinityDropdown', 'Dropdown')
export class DropdownEntity extends ChoiceEntityBase {
    @DataType('string')
    @DisplayName('Label ')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    Label: string | null = 'Untitled';

    @TableView({Selectable: true, Reorderable: true}, DROPWDOWN_PREDEFINED_LIST)
    Choices: ChoiceOption[] | null = [{ Name: 'Select' }, { Name: 'First choice', Value: '1' }, { Name: 'Second choice', Value: '2' }];

    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @DefaultValue('Manual')
    @DisplayName('Sort choices')
    @DataType(KnownFieldTypes.Choices)
    @Choice([{Title: 'As set manually', Value: 'Manual'}, {Title: 'Alphabetically', Value: 'Alphabetical'}])
    public Sorting: DropdownSorting = 'Manual';

    @ContentSection(ContentSectionTitles.DisplaySettings, 2)
    @DisplayName('Field size')
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice(FIELD_SIZE_OPTIONS)
    public FieldSize: FieldSize = FieldSize.None;
}
