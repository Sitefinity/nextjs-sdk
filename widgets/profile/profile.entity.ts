import { OffsetStyle } from '../styling/offset-style';
import { ProfileViewMode } from './interfaces/profile-view-mode';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';
import { RestSdkTypes } from '../../rest-sdk/rest-client';
import { ProfilePostUpdateAction } from './interfaces/profile-post-update-action';
import { ContentSectionTitles, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { SectionsOrder, WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ViewSelector } from '@progress/sitefinity-widget-designers-sdk/decorators/view-selector';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { KeysValues } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Margins } from '@progress/sitefinity-widget-designers-sdk/decorators/margins';
import { LengthDependsOn } from '@progress/sitefinity-widget-designers-sdk/decorators/length-depends-on';

@WidgetEntity('SitefinityProfile', 'Profile')
@SectionsOrder(['Select mode', ContentSectionTitles.DisplaySettings])
export class ProfileEntity {
    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @ViewSelector([{ Value: 'Default' }])
    @DisplayName('Profile template')
    SfViewName: string = 'Default';

    // Advanced
    @WidgetLabel()
    SfWidgetLabel: string = 'Profile';

    @ContentSection(ContentSectionTitles.DisplaySettings, 1)
    @Margins('Profile')
    Margins?: OffsetStyle;

    @ContentSection('Select mode', 1)
    @DisplayName('Mode')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'Edit mode only', Value: ProfileViewMode.Edit },
        { Title: 'Read mode only', Value: ProfileViewMode.Read },
        { Title: 'Both - read and edit mode', Value: ProfileViewMode.ReadEdit }
    ])
    ViewMode?: ProfileViewMode = ProfileViewMode.Edit;

    @ContentSection('Select pages', 1)
    @DisplayName('')
    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility({
        conditions: [ { fieldName: 'ReadEditModeAction', operator: 'Equals', value: 'RedirectToPage' } ],
        inline: true
    })
    ReadEditModeRedirectPage?: MixedContentContext;

    @ContentSection('Select pages', 1)
    @DisplayName('')
    @Content({
        Type: RestSdkTypes.Pages,
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility({
        conditions: [ { fieldName: 'EditModeAction', operator: 'Equals', value: 'RedirectToPage' } ],
        inline: true
    })
    EditModeRedirectPage?: MixedContentContext;

    @ContentSection('Select mode', 1)
    @DisplayName('After saving changes...')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'View a message', Value: ProfilePostUpdateAction.ViewMessage },
        { Title: 'Switch to Read mode', Value: ProfilePostUpdateAction.SwitchToReadMode },
        { Title: 'Redirect to page...', Value: ProfilePostUpdateAction.RedirectToPage }
    ])
    @ConditionalVisibility({
        conditions: [ { fieldName: 'ViewMode', operator: 'Equals', value: 'ReadEdit' } ]
    })
    ReadEditModeAction?: ProfilePostUpdateAction = ProfilePostUpdateAction.ViewMessage;

    @ContentSection('Select mode', 1)
    @DisplayName('After saving changes...')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'View a message', Value: ProfilePostUpdateAction.ViewMessage },
        { Title: 'Redirect to page...', Value: ProfilePostUpdateAction.RedirectToPage }
    ])
    @ConditionalVisibility({
        conditions: [ { fieldName: 'ViewMode', operator: 'Equals', value: 'Edit' } ]
    })
    EditModeAction?: ProfilePostUpdateAction = ProfilePostUpdateAction.ViewMessage;

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS class')
    CssClass?: string;

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Edit profile link label')
    EditProfileLinkLabel = 'Edit profile';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Edit profile header')
    EditProfileHeaderLabel = 'Edit profile';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('First name field label')
    FirstNameLabel = 'First name';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Last name field label')
    LastNameLabel = 'Last name';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Username field label')
    NicknameLabel = 'Nickname';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('About field label')
    AboutLabel = 'About';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Email field label')
    EmailLabel = 'Email';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Password field label')
    PasswordLabel = 'Password';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Save button')
    SaveButtonLabel = 'Save changes';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Change photo link label')
    ChangePhotoLabel = 'Change photo';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Invalid photo error message')
    InvalidPhotoErrorMessage = 'Select image no larger than {0} B and in one of the following formats {1}.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Required field error message')
    ValidationRequiredMessage = 'Field is required.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Invalid email error message')
    InvalidEmailErrorMessage = 'Invalid email format.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Change email label')
    ChangeEmailLabel = 'To change your email address, you are required to enter your password.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Invalid password error message')
    InvalidPasswordErrorMessage = 'Incorrect password.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Success notification')
    SuccessNotification = 'Your changes are saved.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Confirm email change title')
    ConfirmEmailChangeTitleLabel = 'Confirm email change';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Confirm email change message')
    ConfirmEmailChangeDescriptionLabel =
        'To confirm email change for your account a message has been sent to your new email';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Expired activation link title')
    ConfirmEmailChangeTitleExpiredLabel = 'Activation link has expired';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Expired activation link message')
    ConfirmEmailChangeDescriptionExpiredLabel = 'To access your account resend activation link to {0}.';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Send activation link')
    SendActivationLink = 'Send activation link';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Send activation link label')
    SendAgainActivationLink = 'Send again';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Activation link header')
    SendConfirmationLinkSuccessTitle = 'Please check your email';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Activation link label')
    SendConfirmationLinkSuccessMessage = 'An activation link has been sent to {0}';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Activation error title')
    ConfirmEmailChangeTitleErrorLabel = 'Error has occurred';

    @Category(PropertyCategory.Advanced)
    @ContentSection(ContentSectionTitles.LabelsAndMessages)
    @DisplayName('Activation error message')
    ConfirmEmailChangeDescriptionErrorLabel = 'We could not change your email';

    @Category(PropertyCategory.Advanced)
    @ContentSection('Attributes')
    @DisplayName('Attributes for...')
    @DataType(KnownFieldTypes.Attributes)
    @DataModel(KeysValues)
    @LengthDependsOn(null, '', ' ', '[{"Name": "Profile", "Title": "Profile"}]')
    Attributes?: { [key: string]: Array<{ Key: string; Value: string }> };
}
