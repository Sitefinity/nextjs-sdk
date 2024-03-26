import { Choice, ContentSection, ContentSectionTitles, DataType, DefaultValue, DisplayName, KnownFieldTypes, TableView, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk';
import { ChoiceEntityBase } from '../interfaces/choice-entity-base';
import { FIELD_SIZE_OPTIONS, FieldSize } from '../../styling/field-size';
import { DROPWDOWN_PREDEFINED_LIST } from './dropdown-predefined-list';
import { ChoiceOption } from '../common/choice-option';

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
