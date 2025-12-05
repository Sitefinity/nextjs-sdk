import { WidgetMetadata } from '../editor/widget-framework/widget-metadata';
import { CheckboxesCSR } from './form-widgets/checkboxes/checkboxes.csr';
import { CheckboxesEntity } from './form-widgets/checkboxes/checkboxes.entity';
import { FormContentBlockCSR } from './form-widgets/content-block/content-block.csr';
import { FormContentBlockEntity } from './form-widgets/content-block/content-block.entity';
import { DateTimeFieldCSR } from './form-widgets/date-time/date-time-field.csr';
import { DateTimeFieldEntity } from './form-widgets/date-time/date-time-field.entity';
import { DropdownCSR } from './form-widgets/dropdown/dropdown.csr';
import { DropdownEntity } from './form-widgets/dropdown/dropdown.entity';
import { DynamicListCSR } from './form-widgets/dynamic-list/dynamic-list.csr';
import { DynamicListEntity } from './form-widgets/dynamic-list/dynamic-list.entity';
import { FileUploadCSR } from './form-widgets/file-upload/file-upload.csr';
import { FileUploadEntity } from './form-widgets/file-upload/file-upload.entity';
import { MultipleChoiceCSR } from './form-widgets/multiple-choice/multiple-choice.csr';
import { MultipleChoiceEntity } from './form-widgets/multiple-choice/multiple-choice.entity';
import { NumberFieldCSR } from './form-widgets/number/number-field.csr';
import { NumberFieldEntity } from './form-widgets/number/number-field.entity';
import { ParagraphCSR } from './form-widgets/paragraph/paragraph.csr';
import { ParagraphEntity } from './form-widgets/paragraph/paragraph.entity';
import { FormSectionCSR } from './form-widgets/section/section.csr';
import { FormSectionEntity } from './form-widgets/section/section.entity';
import { SubmitButtonCSR } from './form-widgets/submit-button/submit-button.csr';
import { SubmitButtonEntity } from './form-widgets/submit-button/submit-button.entity';
import { TextFieldEntity } from './form-widgets/textfield/text-field.entity';
import { TextFieldCSR } from './form-widgets/textfield/textfield.csr';
import { FormCSR } from './form/form.csr';
import { FormEntity } from './form/form.entity';

export const CSRFormComponents: { [key: string]: WidgetMetadata } = {
    'SitefinityForm': {
        entity: FormEntity,
        componentType: FormCSR,
        editorMetadata: {
            Title: 'Form',
            EmptyIcon: 'plus-circle',
            EmptyIconAction: 'Edit',
            EmptyIconText: 'Select a form',
            Category: 'Content',
            Section: 'Basic',
            HasQuickEditOperation: true,
            InitialProperties: {
                ContentViewDisplayMode: 'Detail'
            }
        },
        ssr: false
    },
    'SitefinityFormSection': {
        entity: FormSectionEntity,
        componentType: FormSectionCSR,
        editorMetadata: {
            Title: 'Section',
            Toolbox: 'Forms',
            Category: 'Layout',
            InitialProperties: {
                SfFieldType: 'FormSection'
            }
        },
        ssr: false
    },
    'SitefinityTextField': {
        entity: TextFieldEntity,
        componentType: TextFieldCSR,
        editorMetadata: {
            Title: 'Textbox',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'ShortText'
            }
        },
        ssr: false
    },
    'SitefinityParagraph': {
        entity: ParagraphEntity,
        componentType: ParagraphCSR,
        editorMetadata: {
            Title: 'Paragraph',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'Paragraph'
            }
        },
        ssr: false
    },
        'SitefinityNumberField': {
        entity: NumberFieldEntity,
        componentType: NumberFieldCSR,
        editorMetadata: {
            Title: 'Number',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'Number'
            },
            IconName: 'number'
        },
        ssr: false
    },
    'SitefinitySubmitButton': {
        entity: SubmitButtonEntity,
        componentType: SubmitButtonCSR,
        editorMetadata: {
            Title: 'Submit button',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'SubmitButton'
            }
        },
        ssr: false
    },
    'SitefinityMultipleChoice': {
        entity: MultipleChoiceEntity,
        componentType: MultipleChoiceCSR,
        editorMetadata: {
            Title: 'Multiple choice',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'MultipleChoice'
            }
        },
        ssr: false
    },
    'SitefinityCheckboxes': {
        entity: CheckboxesEntity,
        componentType: CheckboxesCSR,
        editorMetadata: {
            Title: 'Checkboxes',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            }
        },
        ssr: false
    },
    'SitefinityDropdown': {
        entity: DropdownEntity,
        componentType: DropdownCSR,
        editorMetadata: {
            Title: 'Dropdown',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Dropdown'
            }
        },
        ssr: false
    },
    'SitefinityDynamicList': {
        entity: DynamicListEntity,
        componentType: DynamicListCSR,
        editorMetadata: {
            Title: 'Dynamic list',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            }
        },
        ssr: false
    },
    'SitefinityFileField': {
        entity: FileUploadEntity,
        componentType: FileUploadCSR,
        editorMetadata: {
            Title: 'File upload',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'File'
            }
        },
        ssr: false
    },
    'SitefinityDateTimeField': {
        entity: DateTimeFieldEntity,
        componentType: DateTimeFieldCSR,
        editorMetadata: {
            Title: 'Date and time',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'DateTime'
            },
            IconName: 'date-time'
        },
        ssr: false
    },
    'SitefinityFormContentBlock': {
        entity: FormContentBlockEntity,
        componentType: FormContentBlockCSR,
        editorMetadata: {
            Title: 'Content block',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'ContentBlock'
            },
            IconName: 'content-block'
        },
        ssr: false
    }
};
