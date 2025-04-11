import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { OffsetStyle } from '../styling/offset-style';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { KeysValues } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';

@WidgetEntity('SitefinityResetPassword', 'Reset password')
export class ResetPasswordEntity {
    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @ContentSection('Select pages', 1)
    @DisplayName('Login page')
    @Description('This is the page where you have dropped login form widget.')
    LoginPage?: MixedContentContext;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @ContentSection('Select pages', 1)
    @DisplayName('Registration page')
    @Description('This is the page where you have dropped registration widget.')
    RegistrationPage?: MixedContentContext;

    @ContentSection('Display settings', 1)
    @DisplayName('Reset password template')
    @ViewSelector([{ Value: 'Default' }])
    SfViewName?: string = 'Default';

    @ContentSection('Display settings', 1)
    @Margins('Reset password')
    Margins?: OffsetStyle;

    // Advanced
    @Category(PropertyCategory.Advanced)
    @WidgetLabel()
    SfWidgetLabel: string = 'Reset password';

    @DisplayName('CSS class')
    @Category(PropertyCategory.Advanced)
    CssClass?: string;

    @DisplayName('Membership Provider')
    @Category(PropertyCategory.Advanced)
    MembershipProviderName?: string;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Reset password header')
    ResetPasswordHeader: string = 'Reset password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Password field label')
    NewPasswordLabel: string = 'New password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Repeat password field label')
    RepeatNewPasswordLabel: string = 'Repeat new password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Security question field label')
    SecurityQuestionLabel: string = 'Secret question:';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Save button')
    SaveButtonLabel: string = 'Save';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Success message')
    SuccessMessage: string = 'Your password is successfully changed.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Error message')
    ErrorMessage: string = 'You are unable to reset password. Contact your administrator for assistance.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Back link')
    BackLinkLabel: string = 'Back to login';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Required fields error message.')
    AllFieldsAreRequiredErrorMessage: string = 'All fields are required.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Passwords mismatch error message.')
    PasswordsMismatchErrorMessage: string = 'New password and repeat password don\u0027t match.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Forgotten password header')
    ForgottenPasswordHeader: string = 'Forgot your password?';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Forgotten password label')
    ForgottenPasswordLabel: string =
        'Enter your login email address and you will receive an email with a link to reset your password.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Email field label')
    EmailLabel: string = 'Email';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Send button')
    SendButtonLabel: string = 'Send';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Forgotten password submit message')
    ForgottenPasswordSubmitMessage: string = 'You sent a request to reset your password to';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Forgotten password link message')
    ForgottenPasswordLinkMessage: string =
        'Use the link provided in your email to reset the password for your account.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Invalid email format message')
    InvalidEmailFormatMessage: string = 'Invalid email format.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages', 0)
    @DisplayName('Field is required message')
    FieldIsRequiredMessage: string = 'Field is required.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Attributes')
    @DisplayName('Attributes for...')
    @DataType(KnownFieldTypes.Attributes)
    @DataModel(KeysValues)
    @LengthDependsOn(null, '', ' ', '[{"Name": "ResetPassword", "Title": "Reset password"}]')
    Attributes?: { [key: string]: Array<{ Key: string; Value: string }> };
}
