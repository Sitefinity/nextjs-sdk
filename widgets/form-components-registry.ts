import { WidgetMetadata } from '../editor/widget-framework/widget-metadata';
import { Dropdown } from './form-widgets/dropdown/dropdown';
import { Checkboxes } from './form-widgets/checkboxes/checkboxes';
import { CheckboxesEntity } from './form-widgets/checkboxes/checkboxes.entity';
import { FormContentBlock } from './form-widgets/content-block/content-block';
import { FormContentBlockEntity } from './form-widgets/content-block/content-block.entity';
import { DropdownEntity } from './form-widgets/dropdown/dropdown.entity';
import { DynamicList } from './form-widgets/dynamic-list/dynamic-list';
import { DynamicListEntity } from './form-widgets/dynamic-list/dynamic-list.entity';
import { FileUpload } from './form-widgets/file-upload/file-upload';
import { FileUploadEntity } from './form-widgets/file-upload/file-upload.entity';
import { MultipleChoice } from './form-widgets/multiple-choice/multiple-choice';
import { MultipleChoiceEntity } from './form-widgets/multiple-choice/multiple-choice.entity';
import { Paragraph } from './form-widgets/paragraph/paragraph';
import { ParagraphEntity } from './form-widgets/paragraph/paragraph.entity';
import { FormSection } from './form-widgets/section/section';
import { FormSectionEntity } from './form-widgets/section/section.entity';
import { SubmitButton } from './form-widgets/submit-button/submit-button';
import { SubmitButtonEntity } from './form-widgets/submit-button/submit-button.entity';
import { TextFieldEntity } from './form-widgets/textfield/text-field.entity';
import { TextField } from './form-widgets/textfield/textfield';
import { Form } from './form/form';
import { FormEntity } from './form/form.entity';
import { NumberFieldEntity } from './form-widgets/number/number-field.entity';
import { NumberField } from './form-widgets/number/number-field';
import { DateTimeFieldEntity } from './form-widgets/date-time/date-time-field.entity';
import { DateTimeField } from './form-widgets/date-time/date-time-field';

export const SSRFormComponents: { [key: string]: WidgetMetadata } = {
    'SitefinityForm': {
        entity: FormEntity,
        componentType: Form,
        editorMetadata: {
            Title: 'Form',
            EmptyIcon: 'plus-circle',
            EmptyIconAction: 'Edit',
            EmptyIconText: 'Select a form',
            Category: 'Content',
            Section: 'Basic',
            HasQuickEditOperation: true,
            IconName: 'form',
            InitialProperties: {
                ContentViewDisplayMode: 'Detail'
            }
        },
        ssr: true
    },
    'SitefinityFormSection': {
        entity: FormSectionEntity,
        componentType: FormSection,
        editorMetadata: {
            Title: 'Section',
            Toolbox: 'Forms',
            Category: 'Layout',
            InitialProperties: {
                SfFieldType: 'FormSection'
            },
            IconName: 'section'
        },
        ssr: true
    },
    'SitefinityTextField': {
        entity: TextFieldEntity,
        componentType: TextField,
        editorMetadata: {
            Title: 'Textbox',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'ShortText'
            },
            IconName: 'textbox'
        },
        ssr: true
    },
    'SitefinityParagraph': {
        entity: ParagraphEntity,
        componentType: Paragraph,
        editorMetadata: {
            Title: 'Paragraph',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'Paragraph'
            },
            IconName: 'paragraph'
        },
        ssr: true
    },
        'SitefinityNumberField': {
        entity: NumberFieldEntity,
        componentType: NumberField,
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
        ssr: true
    },
    'SitefinitySubmitButton': {
        entity: SubmitButtonEntity,
        componentType: SubmitButton,
        editorMetadata: {
            Title: 'Submit button',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'SubmitButton'
            },
            IconName: 'button'
        },
        ssr: true
    },
    'SitefinityMultipleChoice': {
        entity: MultipleChoiceEntity,
        componentType: MultipleChoice,
        editorMetadata: {
            Title: 'Multiple choice',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'MultipleChoice'
            },
            IconName: 'multiple-choice'
        },
        ssr: true
    },
    'SitefinityCheckboxes': {
        entity: CheckboxesEntity,
        componentType: Checkboxes,
        editorMetadata: {
            Title: 'Checkboxes',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            },
            IconName: 'checkboxes'
        },
        ssr: true
    },
    'SitefinityDropdown': {
        entity: DropdownEntity,
        componentType: Dropdown,
        editorMetadata: {
            Title: 'Dropdown',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Dropdown'
            },
            IconName: 'dropdown'
        },
        ssr: true
    },
    'SitefinityDynamicList': {
        entity: DynamicListEntity,
        componentType: DynamicList,
        editorMetadata: {
            Title: 'Dynamic list',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            },
            IconName: 'dropdown'
        },
        ssr: true
    },
    'SitefinityFileField': {
        entity: FileUploadEntity,
        componentType: FileUpload,
        editorMetadata: {
            Title: 'File upload',
            Toolbox: 'Forms',
            Category: 'Content',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'File'
            },
            IconName: 'file-upload'
        },
        ssr: true
    },
    'SitefinityDateTimeField': {
        entity: DateTimeFieldEntity,
        componentType: DateTimeField,
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
        ssr: true
    },
    'SitefinityFormContentBlock': {
        entity: FormContentBlockEntity,
        componentType: FormContentBlock,
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
        ssr: true
    }
};
