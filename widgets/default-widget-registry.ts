import { ContentBlock } from './content-block/content-block';
import { ContentList } from './content-list/content-list';
import { CallToAction } from './call-to-action/call-to-action';
import { Classification } from './classification/classification';
import { Image } from './image/image';
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

export const CSRFormComponents: {[key: string]: WidgetMetadata} = {
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
        componentType: FormSection,
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
        componentType: TextField,
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
        componentType: Paragraph,
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
            }
        },
        ssr: false
    },
    'SitefinityMultipleChoice': {
        entity: MultipleChoiceEntity,
        componentType: MultipleChoice,
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
        componentType: Checkboxes,
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
        componentType: Dropdown,
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
        componentType: FileUpload,
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
        ssr: false
    }
};

export const SSRFormComponents: {[key: string]: WidgetMetadata} = {
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

export const defaultWidgetRegistry: WidgetRegistry = {
    widgets: {
        'SitefinityContentBlock': {
            entity: ContentBlockEntity,
            componentType: ContentBlock,
            editorMetadata: {
                Title: 'Content block',
                Category: 'Content',
                Section: 'Basic',
                HasQuickEditOperation: true,
                IconName: 'content-block'
            },
            ssr: true
        },
        'SitefinityImage': {
            entity: ImageEntity,
            componentType: Image,
            editorMetadata: {
                Title: 'Image',
                Category: 'Content',
                Section: 'Basic',
                EmptyIcon: 'picture-o',
                EmptyIconAction: 'Edit',
                EmptyIconText: 'Select image',
                HasQuickEditOperation: true,
                IconName: 'image'
            },
            ssr: true
        },
        'SitefinityButton': {
            entity: CallToActionEntity,
            componentType: CallToAction,
            editorMetadata: {
                Title: 'Call to action',
                Category: 'Content',
                Section: 'Basic',
                EmptyIconText: 'Create call to action',
                HasQuickEditOperation: true,
                IconName: 'call-to-action'
            },
            ssr: true
        },
        'SitefinityContentList': {
            entity: ContentListEntity,
            componentType: ContentList,
            editorMetadata: {
                Title: 'Content list',
                Category: 'Content',
                Section: 'Lists',
                EmptyIconText: 'Select content',
                EmptyIcon: 'plus-circle',
                IconName: 'content-list'
            },
            ssr: true,
            views: {
                'ListWithImage': {
                    Title: 'List with image',
                    ViewFunction: ListWithImageView
                },
                'ListWithSummary': {
                    Title: 'List with summary',
                    ViewFunction: ListWithSummaryView
                },
                'CardsList': {
                    Title: 'Cards list',
                    ViewFunction: CardsListView
                },
                'Details.BlogPosts.Default': {
                    Title: 'Details.Blog posts.Default',
                    ViewFunction: BlogPostDetailView
                },
                'Details.Dynamic.Default': DynamicDetailView,
                'Details.Events.Default': EventDetailView,
                'Details.ListItems.Default': {
                    Title: 'Details.List items.Default',
                    ViewFunction: ListItemDetailView
                },
                'Details.News.Default': NewsItemDetailView
            }
        },
        'SitefinityDocumentList': {
            entity: DocumentListEntity,
            componentType: DocumentList,
            editorMetadata: {
                Title: 'Document list',
                EmptyIconText: 'Select documents',
                EmptyIcon: 'plus-circle',
                Category: 'Content',
                Section: 'Lists',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                IconName: 'document'
            },
            ssr: true,
            views: {
                'DocumentList': {
                    Title: 'Document list',
                    ViewFunction: DocumentListListView
                },
                'DocumentTable': {
                    Title: 'Document table',
                    ViewFunction: DocumentListGridView
                },
                'Details.DocumentDetails': {
                    Title: 'Details.Document details',
                    ViewFunction: DocumentDetailItemView
                }
            }
        },
        'SitefinityNavigation': {
            entity: NavigationEntity,
            componentType: Navigation,
            editorMetadata: {
                Title: 'Navigation',
                Category: 'Content',
                Section: 'Navigation and search',
                EmptyIcon: 'tag',
                EmptyIconAction: 'None',
                EmptyIconText: 'No pages have been published',
                HasQuickEditOperation: true,
                IconName: 'navigation'
            },
            ssr: true
        },
        'SitefinityBreadcrumb': {
            entity: BreadcrumbEntity,
            componentType: Breadcrumb,
            editorMetadata: {
                Title: 'Breadcrumb',
                Category: 'Content',
                Section: 'Navigation and search',
                HasQuickEditOperation: true,
                IconName: 'breadcrumb'
            },
            ssr: true
        },
        'SitefinitySearchBox': {
            entity: SearchBoxEntity,
            componentType: SearchBox,
            editorMetadata: {
                Title: 'Search box',
                Category: 'Content',
                Section: 'Navigation and search',
                EmptyIcon: 'search',
                EmptyIconText: 'Set where to search',
                HasQuickEditOperation: true,
                IconName: 'search'
            },
            ssr: true
        },
        'SitefinitySearchResults': {
            entity: SearchResultsEntity,
            componentType: SearchResults,
            editorMetadata: {
                Title: 'Search results',
                EmptyIconText: 'Search results',
                EmptyIcon: 'search',
                Category: 'Content',
                Section: 'Navigation and search',
                HasQuickEditOperation: true,
                IconName: 'search',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
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
                Category: 'Content',
                Section: 'Navigation and search',
                HasQuickEditOperation: true,
                IconName: 'search',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinityClassification': {
            entity: ClassificationEntity,
            componentType: Classification,
            editorMetadata: {
                Title: 'Classification',
                Category: 'Content',
                Section: 'Navigation and search',
                EmptyIconText: 'Select classification',
                HasQuickEditOperation: true,
                IconName: 'classification',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinityLanguageSelector': {
            entity: LanguageSelectorEntity,
            componentType: LanguageSelector,
            editorMetadata: {
                Title: 'Language selector',
                Category: 'Content',
                Section: 'Navigation and search',
                HasQuickEditOperation: true,
                HideEmptyVisual: true,
                IconName: 'language',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinityLoginForm': {
            entity: LoginFormEntity,
            componentType: LoginForm,
            editorMetadata: {
                Title: 'Login form',
                Section: 'Login and users',
                Category: 'Content',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                IconName: 'login',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinityRegistration': {
            entity: RegistrationEntity,
            componentType: Registration,
            editorMetadata: {
                Title: 'Registration form',
                Section: 'Login and users',
                Category: 'Content',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                IconName: 'registration',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinityResetPassword': {
            entity: ResetPasswordEntity,
            componentType: ResetPassword,
            editorMetadata: {
                Title: 'Reset password',
                Section: 'Login and users',
                Category: 'Content',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                IconName: 'password',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinityChangePassword': {
            entity: ChangePasswordEntity,
            componentType: ChangePassword,
            editorMetadata: {
                Title: 'Change password',
                Section: 'Login and users',
                Category: 'Content',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                IconName: 'password',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        'SitefinitySection': {
            entity: SectionEntity,
            componentType: Section,
            editorMetadata: {
                Title: 'Section',
                Category: 'Layout',
                Section: 'Empty section',
                IconName: 'section',
                WidgetBehavior: {
                    NotPersonalizable: true
                }
            },
            ssr: true
        },
        ...SSRFormComponents
    }
};
