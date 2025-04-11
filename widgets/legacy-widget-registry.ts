import { ContentBlock } from './content-block/content-block';
import { ContentList } from './content-list/content-list';
import { CallToAction } from './call-to-action/call-to-action';
import { Classification } from './classification/classification';
import { SitefinityImage } from './image/image';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { Navigation } from './navigation/navigation';
import { SearchBox } from './search-box/search-box';
import { LoginForm } from './login-form/login-form';
import { ChangePassword } from './change-password/change-password';
import { ResetPassword } from './reset-password/reset-password';
import { Registration } from './registration/registration';
import { LanguageSelector } from './language-selector/language-selector';
import { Section } from './section/section';
import { WidgetRegistry } from '../editor/widget-framework/widget-registry';
import { DocumentList } from './document-list/document-list';
import { SearchResults } from './search-results/search-results';
import { SearchFacets } from './search-facets/search-facets';
import { Form } from './form/form';
import { FormSection } from './form-widgets/section/section';
import { Checkboxes } from './form-widgets/checkboxes/checkboxes';
import { FormContentBlock } from './form-widgets/content-block/content-block';
import { Dropdown } from './form-widgets/dropdown/dropdown';
import { DynamicList } from './form-widgets/dynamic-list/dynamic-list';
import { FileUpload } from './form-widgets/file-upload/file-upload';
import { MultipleChoice } from './form-widgets/multiple-choice/multiple-choice';
import { Paragraph } from './form-widgets/paragraph/paragraph';
import { SubmitButton } from './form-widgets/submit-button/submit-button';
import { TextField } from './form-widgets/textfield/textfield';
import { ClassificationEntity } from './classification/classification-entity';
import { ContentListEntity } from './content-list/content-list-entity';
import { SectionEntity } from './section/section.entity';
import { ImageEntity } from './image/image.entity';
import { ContentBlockEntity } from './content-block/content-block.entity';

import { SearchFacetsEntity } from './search-facets/search-facets.entity';
import { BreadcrumbEntity } from './breadcrumb/breadcrumb.entity';
import { DocumentListEntity } from './document-list/document-list-entity';
import { NavigationEntity } from './navigation/navigation.entity';
import { LoginFormEntity } from './login-form/login-form.entity';
import { ResetPasswordEntity } from './reset-password/reset-password.entity';
import { RegistrationEntity } from './registration/registration.entity';
import { ChangePasswordEntity } from './change-password/change-password.entity';
import { FormEntity } from './form/form.entity';
import { SearchResultsEntity } from './search-results/search-results.entity';
import { SearchBoxEntity } from './search-box/search-box.entity';
import { CallToActionEntity } from './call-to-action/call-to-action.entity';
import { CheckboxesEntity } from './form-widgets/checkboxes/checkboxes.entity';
import { DropdownEntity } from './form-widgets/dropdown/dropdown.entity';
import { FileUploadEntity } from './form-widgets/file-upload/file-upload.entity';
import { MultipleChoiceEntity } from './form-widgets/multiple-choice/multiple-choice.entity';
import { SubmitButtonEntity } from './form-widgets/submit-button/submit-button.entity';
import { ParagraphEntity } from './form-widgets/paragraph/paragraph.entity';
import { TextFieldEntity } from './form-widgets/textfield/text-field.entity';
import { FormSectionEntity } from './form-widgets/section/section.entity';
import { FormContentBlockEntity } from './form-widgets/content-block/content-block.entity';
import { DynamicListEntity } from './form-widgets/dynamic-list/dynamic-list.entity';
import { BlogPostDetailView } from './content-list/detail/content-list-detail.blog-post.view';
import { DynamicDetailView } from './content-list/detail/content-list-detail.dynamic.view';
import { EventDetailView } from './content-list/detail/content-list-detail.event.view';
import { ListItemDetailView } from './content-list/detail/content-list-detail.list-item.view';
import { NewsItemDetailView } from './content-list/detail/content-list-detail.news.view';
import { CardsListView } from './content-list/master/cards-list/cards-list.view';
import { ListWithImageView } from './content-list/master/list-with-image/list-with-image.view';
import { ListWithSummaryView } from './content-list/master/list-with-summary/list-with-summary.view';
import { DocumentDetailItemView } from './document-list/document-list-detail-item.view';
import { DocumentListGridView } from './document-list/document-list-grid.view';
import { DocumentListListView } from './document-list/document-list-list.view';
import { FormCSR } from './form/form.csr';
import { DynamicListCSR } from './form-widgets/dynamic-list/dynamic-list.csr';
import { WidgetMetadata } from '../editor/widget-framework/widget-metadata';
import { LanguageSelectorEntity } from './language-selector/language-selector-entity';

export const LegacyCSRFormComponents: {[key: string]: WidgetMetadata} = {
    'SitefinityForm': {
        entity: FormEntity,
        componentType: FormCSR,
        editorMetadata: {
            Title: 'Form',
            EmptyIcon: 'plus-circle',
            EmptyIconAction: 'Edit',
            EmptyIconText: 'Select a form',
            Section: 'Basic',
            HasQuickEditOperation: true
        },
        ssr: false
    },
    'SitefinityFormSection': {
        entity: FormSectionEntity,
        componentType: FormSection,
        editorMetadata: {
            Title: 'Section',
            Toolbox: 'Forms',
            Category: 'Layout & Presets',
            InitialProperties: {
                SfFieldType: 'FormSection'
            }
        },
        ssr: false
    },
    'SitefinityCheckboxes': {
        entity: CheckboxesEntity,
        componentType: Checkboxes,
        editorMetadata: {
            Title: 'Checkboxes',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            }
        },
        ssr: false
    },
    'SitefinityFormContentBlock': {
        entity: FormContentBlockEntity,
        componentType: FormContentBlock,
        editorMetadata: {
            Title: 'Content Block',
            Toolbox: 'Forms',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'ContentBlock'
            }
        },
        ssr: false
    },
    'SitefinityDropdown': {
        entity: DropdownEntity,
        componentType: Dropdown,
        editorMetadata: {
            Title: 'Dropdown',
            Toolbox: 'Forms',
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
            Title: 'Dynamic List',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            }
        },
        ssr: false
    },
    'SitefinityFileField': {
        entity: FileUploadEntity,
        componentType: FileUpload,
        editorMetadata: {
            Title: 'File Upload',
            Toolbox: 'Forms',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'File'
            }
        },
        ssr: false
    },
    'SitefinityMultipleChoice': {
        entity: MultipleChoiceEntity,
        componentType: MultipleChoice,
        editorMetadata: {
            Title: 'Multiple Choice',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'MultipleChoice'
            }
        },
        ssr: false
    },
    'SitefinityParagraph': {
        entity: ParagraphEntity,
        componentType: Paragraph,
        editorMetadata: {
            Title: 'Paragraph',
            Toolbox: 'Forms',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'Paragraph'
            }
        },
        ssr: false
    },
    'SitefinitySubmitButton': {
        entity: SubmitButtonEntity,
        componentType: SubmitButton,
        editorMetadata: {
            Title: 'Submit Button',
            Toolbox: 'Forms',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'SubmitButton'
            }
        },
        ssr: false
    },
    'SitefinityTextField': {
        entity: TextFieldEntity,
        componentType: TextField,
        editorMetadata: {
            Title: 'Textbox',
            Toolbox: 'Forms',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'ShortText'
            }
        },
        ssr: false
    }
};

export const LegacySSRFormComponents: {[key: string]: WidgetMetadata} = {
    'SitefinityForm': {
        entity: FormEntity,
        componentType: Form,
        editorMetadata: {
            Title: 'Form',
            EmptyIcon: 'plus-circle',
            EmptyIconAction: 'Edit',
            EmptyIconText: 'Select a form',
            Section: 'Basic',
            HasQuickEditOperation: true
        },
        ssr: true
    },
    'SitefinityFormSection': {
        entity: FormSectionEntity,
        componentType: FormSection,
        editorMetadata: {
            Title: 'Section',
            Toolbox: 'Forms',
            Category: 'Layout & Presets',
            InitialProperties: {
                SfFieldType: 'FormSection'
            }
        },
        ssr: true
    },
    'SitefinityCheckboxes': {
        entity: CheckboxesEntity,
        componentType: Checkboxes,
        editorMetadata: {
            Title: 'Checkboxes',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            }
        },
        ssr: true
    },
    'SitefinityFormContentBlock': {
        entity: FormContentBlockEntity,
        componentType: FormContentBlock,
        editorMetadata: {
            Title: 'Content Block',
            Toolbox: 'Forms',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'ContentBlock'
            }
        },
        ssr: true
    },
    'SitefinityDropdown': {
        entity: DropdownEntity,
        componentType: Dropdown,
        editorMetadata: {
            Title: 'Dropdown',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Dropdown'
            }
        },
        ssr: true
    },
    'SitefinityDynamicList': {
        entity: DynamicListEntity,
        componentType: DynamicList,
        editorMetadata: {
            Title: 'Dynamic List',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'Checkboxes'
            }
        },
        ssr: true
    },
    'SitefinityFileField': {
        entity: FileUploadEntity,
        componentType: FileUpload,
        editorMetadata: {
            Title: 'File Upload',
            Toolbox: 'Forms',
            Section: 'Other',
            InitialProperties: {
                SfFieldType: 'File'
            }
        },
        ssr: true
    },
    'SitefinityMultipleChoice': {
        entity: MultipleChoiceEntity,
        componentType: MultipleChoice,
        editorMetadata: {
            Title: 'Multiple Choice',
            Toolbox: 'Forms',
            Section: 'Choices',
            InitialProperties: {
                SfFieldType: 'MultipleChoice'
            }
        },
        ssr: true
    },
    'SitefinityParagraph': {
        entity: ParagraphEntity,
        componentType: Paragraph,
        editorMetadata: {
            Title: 'Paragraph',
            Toolbox: 'Forms',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'Paragraph'
            }
        },
        ssr: true
    },
    'SitefinitySubmitButton': {
        entity: SubmitButtonEntity,
        componentType: SubmitButton,
        editorMetadata: {
            Title: 'Submit Button',
            Toolbox: 'Forms',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'SubmitButton'
            }
        },
        ssr: true
    },
    'SitefinityTextField': {
        entity: TextFieldEntity,
        componentType: TextField,
        editorMetadata: {
            Title: 'Textbox',
            Toolbox: 'Forms',
            Section: 'Basic',
            InitialProperties: {
                SfFieldType: 'ShortText'
            }
        },
        ssr: true
    }
};

export const legacyWidgetRegistry: WidgetRegistry = {
    widgets: {
        'SitefinityBreadcrumb': {
            entity: BreadcrumbEntity,
            componentType: Breadcrumb,
            editorMetadata: {
                Title: 'Breadcrumb',
                Category: 'Navigation & Search',
                Section: 'Main navigation',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityClassification': {
            entity: ClassificationEntity,
            componentType: Classification,
            editorMetadata: {
                Title: 'Classification',
                Category: 'Navigation & Search',
                Section: 'Search and classification',
                EmptyIconText: 'Select classification',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityImage': {
            entity: ImageEntity,
            componentType: SitefinityImage,
            editorMetadata: {
                Title: 'Image',
                Section: 'Basic',
                EmptyIcon: 'picture-o',
                EmptyIconAction: 'Edit',
                EmptyIconText: 'Select image',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityLoginForm': {
            entity: LoginFormEntity,
            componentType: LoginForm,
            editorMetadata: {
                Title: 'Login form',
                Section: 'Login',
                Category: 'Login & Users',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityChangePassword': {
            entity: ChangePasswordEntity,
            componentType: ChangePassword,
            editorMetadata: {
                Title: 'Change password',
                Section: 'Login',
                Category: 'Login & Users',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityResetPassword': {
            entity: ResetPasswordEntity,
            componentType: ResetPassword,
            editorMetadata: {
                Title: 'Reset password',
                Section: 'Login',
                Category: 'Login & Users',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityRegistration': {
            entity: RegistrationEntity,
            componentType: Registration,
            editorMetadata: {
                Title: 'Registration',
                Section: 'Login',
                Category: 'Login & Users',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityNavigation': {
            entity: NavigationEntity,
            componentType: Navigation,
            editorMetadata: {
                Title: 'Navigation',
                Category: 'Navigation & Search',
                Section: 'Main navigation',
                EmptyIcon: 'tag',
                EmptyIconAction: 'None',
                EmptyIconText: 'No pages have been published',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinitySearchBox': {
            entity: SearchBoxEntity,
            componentType: SearchBox,
            editorMetadata: {
                Title: 'SearchBox',
                Category: 'Navigation & Search',
                Section: 'Search and classification',
                EmptyIcon: 'search',
                EmptyIconText: 'Set where to search',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityButton': {
            entity: CallToActionEntity,
            componentType: CallToAction,
            editorMetadata: {
                Title: 'Call to action',
                Section: 'Basic',
                EmptyIconText: 'Create call to action',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityContentBlock': {
            entity: ContentBlockEntity,
            componentType: ContentBlock,
            editorMetadata: {
                Title: 'Content block',
                Section: 'Basic',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinitySection': {
            entity: SectionEntity,
            componentType: Section,
            editorMetadata: {
                Title: 'Section',
                Category: 'Layout & Presets'
            },
            ssr: true
        },
        'SitefinityContentList': {
            entity: ContentListEntity,
            componentType: ContentList,
            editorMetadata: {
                Title: 'Content list',
                Section: 'Basic',
                EmptyIconText: 'Select content',
                EmptyIcon: 'plus-circle',
                WidgetBehavior: {
                    IsContentLocation: true
                }
            },
            ssr: true,
            templates: {
                'ListWithImage': ListWithImageView,
                'ListWithSummary': ListWithSummaryView,
                'CardsList': CardsListView,
                'Details.BlogPosts.Default': BlogPostDetailView,
                'Details.Dynamic.Default': DynamicDetailView,
                'Details.Events.Default': EventDetailView,
                'Details.ListItems.Default': ListItemDetailView,
                'Details.News.Default': NewsItemDetailView
            }
        },
        'SitefinityDocumentList': {
            entity: DocumentListEntity,
            componentType: DocumentList,
            editorMetadata: {
                Title: 'Document list',
                EmptyIconText: 'Select document',
                EmptyIcon: 'plus-circle',
                Section: 'Basic',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                WidgetBehavior: {
                    IsContentLocation: true
                }
            },
            ssr: true,
            templates: {
                'DocumentList': DocumentListListView,
                'DocumentTable': DocumentListGridView,
                'Details.DocumentDetails': DocumentDetailItemView
            }
        },
        'SitefinitySearchResults': {
            entity: SearchResultsEntity,
            componentType: SearchResults,
            editorMetadata: {
                Title: 'Search results',
                EmptyIconText: 'Search results',
                EmptyIcon: 'search',
                Category: 'Navigation & Search',
                Section: 'Search and classification',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityFacets': {
            entity: SearchFacetsEntity,
            componentType: SearchFacets,
            editorMetadata: {
                Title: 'Search facets',
                EmptyIconText: 'Select search facets',
                EmptyIcon: 'search',
                Category: 'Navigation & Search',
                Section: 'Search and classification',
                HasQuickEditOperation: true
            },
            ssr: true
        },
        'SitefinityLanguageSelector': {
            entity: LanguageSelectorEntity,
            componentType: LanguageSelector,
            editorMetadata: {
                Title: 'Language Selector',
                Category: 'Navigation & Search',
                Section: 'Search and classification',
                HasQuickEditOperation: true,
                HideEmptyVisual: true
            },
            ssr: true
        },
        ...LegacySSRFormComponents
    }
};
