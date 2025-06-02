import { Attributes, Category, Choice, ConditionalVisibility, Content, ContentSection, DataType, DefaultValue, Description, DisplayName, Group, KnownFieldTypes, Margins, PropertyCategory, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { OffsetStyle } from '../styling/offset-style';
import { PostLoginAction } from './interfaces/post-login-action';
import { RestSdkTypes } from '../../rest-sdk/rest-client';

@WidgetEntity('SitefinityLoginForm', 'Login form')
export class LoginFormEntity {
    @DisplayName('After login users will...')
    @DataType(KnownFieldTypes.RadioChoice)
    @ContentSection('Select pages', 1)
    @Choice([
        { Value: 'StayOnSamePage', Title: 'Stay on the same page' },
        { Value: 'RedirectToPage', Title: 'Redirect to page...' }
    ])
    PostLoginAction: PostLoginAction = PostLoginAction.StayOnSamePage;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @DisplayName('')
    @ContentSection('Select pages', 1)
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022PostLoginAction\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022RedirectToPage\u0022}],\u0022inline\u0022:\u0022true\u0022}')
    @DefaultValue(null)
    PostLoginRedirectPage?: MixedContentContext;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @DisplayName('Registration page')
    @ContentSection('Select pages', 1)
    @Description('This is the page where you have dropped the Registration form widget. If you leave this field empty, a link to the Registration page will not be displayed in the Login form widget.')
    @DefaultValue(null)
    RegistrationPage?: MixedContentContext;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @DisplayName('Reset password page')
    @ContentSection('Select pages', 1)
    @Description('This is the page where you have dropped the Reset password widget. If you leave this field empty, a link to the Reset password page will not be displayed in the Login form widget.')
    @DefaultValue(null)
    ResetPasswordPage?: MixedContentContext;

    @DisplayName('Show \u0022Remember me\u0022 checkbox')
    @DataType(KnownFieldTypes.CheckBox)
    @Group('Login form options')
    @ContentSection('Select pages', 1)
    RememberMe: boolean = false;

    //Login with external providers
    @DisplayName('Allow users to log in with...')
    @ContentSection('Login with external providers', 1)
    @DataType(KnownFieldTypes.MultipleChoiceChip)
    @Choice({
        ActionTitle: 'Select external providers',
        ButtonTitle: 'Add',
        ServiceUrl: '/Default.GetExternalProviders()'
    })
    ExternalProviders?: string[];

    @ContentSection('Display settings', 1)
    @DisplayName('Login form template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName?: string = 'Default';

    @ContentSection('Display settings', 1)
    @Margins('Login form')
    Margins?: OffsetStyle;

    // Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Login form';

    @DisplayName('CSS class')
    @Category(PropertyCategory.Advanced)
    CssClass?: string;

    @DisplayName('Membership Provider')
    @Category(PropertyCategory.Advanced)
    MembershipProviderName?: string;

    // Labels and messages
    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Login form header')
    Header: string = 'Login';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Email field label')
    EmailLabel: string = 'Email / Username';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Password field label')
    PasswordLabel: string = 'Password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Login form button')
    SubmitButtonLabel: string = 'Log in';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Incorrect credentials message')
    ErrorMessage: string = 'Incorrect credentials.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Remember me checkbox')
    RememberMeLabel: string = 'Remember me';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Forgotten password link')
    ForgottenPasswordLinkLabel: string = 'Forgotten password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Not registered label')
    NotRegisteredLabel: string = 'Not registered yet?';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Register link')
    RegisterLinkText: string = 'Register now';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('External providers header')
    ExternalProvidersHeader: string = 'or use account in...';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Required fields error message')
    ValidationRequiredMessage: string = 'All fields are required.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Invalid email error message')
    ValidationInvalidEmailMessage: string = 'Invalid email format.';

    @Attributes('LoginForm', 'Login form')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
