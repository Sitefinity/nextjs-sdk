import { NumericRange } from '../common/numeric-range';
import { FileTypes } from './interface/file-types';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Group } from '@progress/sitefinity-widget-designers-sdk/decorators/group';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Suffix } from '@progress/sitefinity-widget-designers-sdk/decorators/suffix';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { Browsable } from '@progress/sitefinity-widget-designers-sdk/decorators/browsable';

@WidgetEntity('SitefinityFileField', 'File upload')
export class FileUploadEntity {
    @ContentSection(ContentSectionTitles.LabelsAndContent, 1)
    Label: string = 'Upload file';

    @Description('Suitable for giving examples how the entered value will be used.')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 2)
    @DisplayName('Instructional text')
    InstructionalText?: string;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 3)
    @DataType(KnownFieldTypes.CheckBox)
    @DisplayName('Upload multiple files')
    @Group('Options')
    AllowMultipleFiles: boolean = false;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 4)
    @DisplayName('Required field')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Required: boolean = false;

    @ContentSection(ContentSectionTitles.LabelsAndContent, 5)
    @DisplayName('Hide field initially (use form rules to display it)')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Options')
    Hidden: boolean = false;

    @DisplayName('Error message if the field is empty')
    @ContentSection(ContentSectionTitles.LabelsAndContent, 7)
    @ConditionalVisibility({'conditions':[{'fieldName':'Required','operator':'Equals','value':true}]})
    RequiredErrorMessage: string = '{0} field is required';

    @ContentSection(ContentSectionTitles.Limitations)
    @DataType(KnownFieldTypes.Range)
    @DataModel(NumericRange)
    @Suffix('MB')
    Range: NumericRange | null = null;

    @ContentSection(ContentSectionTitles.Limitations)
    @DisplayName('Error message if file size is out of range')
    FileSizeViolationMessage: string = 'The size of the selected file is too large';

    @ContentSection(ContentSectionTitles.Limitations)
    @DataType(KnownFieldTypes.FileTypes)
    @DisplayName('File types')
    @DataModel(FileTypes)
    FileTypes: FileTypes | null = null;

    @ContentSection(ContentSectionTitles.Limitations)
    @DisplayName('Error message if file type is not allowed')
    @ConditionalVisibility('{"conditions":[{"fieldName":"FileTypes","operator":"NotEquals","value":null}]}')
    FileTypeViolationMessage: string = 'File type is not allowed to upload';
    
    @ViewSelector([{Value: 'Default'}])
    @ContentSection(ContentSectionTitles.DisplaySettings)
    @DisplayName('Template')
    SfViewName: string = 'Default';

    @Category(PropertyCategory.Advanced)
    @ContentSection('AdvancedMain', 2)
    @DisplayName('CSS class')
    CssClass?: string;

    @Browsable(false)
    SfFieldType?: string;
    
    @Browsable(false)
    SfFieldName?: string;
}
