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
import { SitefinityAssistant } from './sitefinity-assistant/sitefinity-assistant';
import { filterSitefinityAssistantWidget } from './sitefinity-assistant/sitefinity-assistant-widget-filter';
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
import { SearchResultsEntity } from './search-results/search-results.entity';
import { SearchBoxEntity } from './search-box/search-box.entity';
import { CallToActionEntity } from './call-to-action/call-to-action.entity';
import { SitefinityAssistantEntity } from './sitefinity-assistant/sitefinity-assistant.entity';
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
import { LanguageSelectorEntity } from './language-selector/language-selector-entity';
import { ProfileEntity } from './profile/profile.entity';
import { Profile } from './profile/profile';
import { SSRFormComponents } from './form-components-registry';

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
            componentType: SitefinityImage,
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
                IconName: 'content-list',
                WidgetBehavior: {
                    IsContentLocation: true
                }
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
                IconName: 'document',
                WidgetBehavior: {
                    IsContentLocation: true
                }
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
        'SitefinityProfile': {
            entity: ProfileEntity,
            componentType: Profile,
            editorMetadata: {
                Title: 'Profile',
                Section: 'Login and users',
                Category: 'Content',
                EmptyIconAction: 'Edit',
                HasQuickEditOperation: true,
                IconName: 'profile',
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
        'SitefinityAssistant': {
            entity: SitefinityAssistantEntity,
            componentType: SitefinityAssistant,
            editorMetadata: {
                Title: 'AI assistant',
                Category: 'Content',
                Section: 'Marketing',
                EmptyIconText: 'Select an AI assistant',
                EmptyIcon: 'pencil',
                IconName: 'chat'
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
    },
    filters: [
        filterSitefinityAssistantWidget
    ]
};
