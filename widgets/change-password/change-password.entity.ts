import { Attributes, Category, Choice, ConditionalVisibility, Content, ContentSection, DataType, DefaultValue, KnownFieldTypes, Margins, PropertyCategory, ViewSelector, WidgetEntity, WidgetLabel } from '@progress/sitefinity-widget-designers-sdk';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { OffsetStyle } from '../styling/offset-style';
import { PostPasswordChangeAction } from './interfaces/post-password-change-action';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk';
import { RestSdkTypes } from '../../rest-sdk/rest-client';

@WidgetEntity('SitefinityChangePassword', 'Change password')
export class ChangePasswordEntity {
    @ContentSection('Change password setup')
    @DisplayName('After change users will...')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'View a message', Value: PostPasswordChangeAction.ViewAMessage },
        { Title: 'Redirect to page...', Value: PostPasswordChangeAction.RedirectToPage }
    ])
    PostPasswordChangeAction?: PostPasswordChangeAction = PostPasswordChangeAction.ViewAMessage;

    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @DisplayName('')
    @ContentSection('Change password setup', 1)
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022PostPasswordChangeAction\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022RedirectToPage\u0022}],\u0022inline\u0022:\u0022true\u0022}')
    @DefaultValue(null)
    PostPasswordChangeRedirectPage?: MixedContentContext;

    @DisplayName('Message')
    @ContentSection('Change password setup', 2)
    @DataType(KnownFieldTypes.TextArea)
    @ConditionalVisibility('{\u0022conditions\u0022:[{\u0022fieldName\u0022:\u0022PostPasswordChangeAction\u0022,\u0022operator\u0022:\u0022Equals\u0022,\u0022value\u0022:\u0022ViewAMessage\u0022}]}')
    PostPasswordChangeMessage: string = 'Your password was changed successfully!';

    @ContentSection('Display settings', 0)
    @DisplayName('Change password template')
    @ViewSelector([{Value: 'Default'}])
    SfViewName?: string = 'Default';

    @ContentSection('Display settings', 1)
    @Margins('Change password')
    Margins?: OffsetStyle;

    // Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Change password';

    @DisplayName('CSS class')
    @Category(PropertyCategory.Advanced)
    CssClass?: string;

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Change password header')
    Header: string = 'Change password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Current password field label')
    CurrentPassword: string = 'Current password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('New password field label')
    NewPassword: string = 'New password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Repeat password field label')
    ConfirmPassword: string = 'Repeat new password';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Submit button')
    SubmitButtonLabel: string = 'Save';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Login error message')
    LoginFirstMessage: string = 'You need to be logged in to change your password.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Required fields error message')
    ValidationRequiredMessage: string = 'All fields are required.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('Password mismatch error message')
    ValidationMismatchMessage: string = 'New password and repeat password don\'t match.';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Labels and messages')
    @DisplayName('External provider message')
    ExternalProviderMessageFormat: string = 'Your profile does not store any passwords, because you are registered with {0}';

    @Attributes('ChangePassword', 'Change password')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
