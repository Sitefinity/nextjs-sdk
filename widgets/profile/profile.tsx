import { RenderView } from '../common/render-view';
import { ProfileDefaultView } from './profile.view';
import { getMinimumWidgetContext, WidgetContext } from '../../editor/widget-framework/widget-context';
import { ProfileEntity } from './profile.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ProfileViewProps } from './interfaces/profile.view-props';
import { getCustomAttributes, htmlAttributes, setWarning } from '../../editor/widget-framework/attributes';
import { StyleGenerator } from '../styling/style-generator.service';
import { classNames } from '../../editor/utils/classNames';
import { StylingConfig } from '../styling/styling-config';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { ActivationMethod } from '../../rest-sdk/dto/registration-settings';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { ProfileViewMode } from './interfaces/profile-view-mode';
import { ProfilePostUpdateAction } from './interfaces/profile-post-update-action';

export async function Profile(props: WidgetContext<ProfileEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity: ProfileEntity = props.model.Properties;
    const context = props.requestContext;
    const viewProps: ProfileViewProps<ProfileEntity> = populateViewProps(entity, props);

    const user = !context.isEdit ? null : await RestClient.getCurrentUser().then((user) => {
        const hasUser = (user && user.IsAuthenticated);
        if (hasUser) {
            return user;
        }
    });

    switch (entity.ViewMode) {
        case ProfileViewMode.Edit:{
            if (entity.EditModeAction === ProfilePostUpdateAction.RedirectToPage) {
                try {
                    const editModeRedirectPage = await RestClientForContext.getItem<PageItem>(entity.EditModeRedirectPage!, { type: RestSdkTypes.Pages, culture: context.culture });
                    if (editModeRedirectPage) {
                        viewProps.editModeRedirectUrl = editModeRedirectPage.ViewUrl;
                    }
                } catch (error) { /* empty */ }
            }
            break;
        }
        case ProfileViewMode.ReadEdit:{
            if (entity.ReadEditModeAction === ProfilePostUpdateAction.RedirectToPage) {
                try {
                    const readEditModeRedirectPage = await RestClientForContext.getItem<PageItem>(entity.ReadEditModeRedirectPage!, { type: RestSdkTypes.Pages, culture: context.culture });
                    if (readEditModeRedirectPage) {
                        viewProps.readEditModeRedirectUrl = readEditModeRedirectPage.ViewUrl;
                    }
                } catch (error) { /* empty */ }
            }
            break;
        }
        default:
            break;
    }

    if (user?.Id) {
        viewProps.id = user?.Id;
    }

    if (user?.Email) {
        viewProps.email = user?.Email;
    }

    viewProps.firstName = user?.FirstName!;
    viewProps.lastName = user?.LastName!;
    viewProps.nickname = user?.Nickname!;
    viewProps.about = user?.About!;
    viewProps.avatarUrl = user?.Avatar!;
    viewProps.allowedAvatarFormats = user?.AllowedAvatarFormats;
    viewProps.readOnlyFields = user?.ReadOnlyFields;
    viewProps.customFields = user?.CustomFields;
    viewProps.isUserAuthenticated = user?.IsAuthenticated;

    const regSettings = await RestClient.getRegistrationSettings({ traceContext: ctx });
    if (!regSettings.SmtpConfigured && regSettings.ActivationMethod === ActivationMethod.AfterConfirmation) {
        const warning = 'Confirmation email cannot be sent because the system has not been configured to send emails. Configure SMTP settings or contact your administrator for assistance.';
        setWarning(viewProps.attributes, warning);
    }

    viewProps.activationMethod = regSettings.ActivationMethod;

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <ProfileDefaultView {...viewProps} />
      </RenderView>
    );
}

function populateViewProps(entity: ProfileEntity, widgetContext: WidgetContext<ProfileEntity>): ProfileViewProps<ProfileEntity> {
    const dataAttributes = htmlAttributes(widgetContext);
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    dataAttributes['className'] = classNames(entity.CssClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Profile');

    return {
        updateProfileHandlerPath: `/${RootUrlService.getWebServicePath()}/users/updateProfile`,
        sendAgainActivationLinkUrl: `/${RootUrlService.getWebServicePath()}/users/sendAgain`,
        labels: {
            header: entity.EditProfileHeaderLabel,
            firstNameLabel: entity.FirstNameLabel,
            lastNameLabel: entity.LastNameLabel,
            nicknameLabel: entity.NicknameLabel,
            aboutLabel: entity.AboutLabel,
            emailLabel: entity.EmailLabel,
            passwordLabel: entity.PasswordLabel,
            saveButtonLabel: entity.SaveButtonLabel,
            changePhotoLabel: entity.ChangePhotoLabel,
            invalidPhotoErrorMessage: entity.InvalidPhotoErrorMessage,
            validationRequiredMessage: entity.ValidationRequiredMessage,
            invalidEmailErrorMessage: entity.InvalidEmailErrorMessage,
            changeEmailLabel: entity.ChangeEmailLabel,
            invalidPasswordErrorMessage: entity.InvalidPasswordErrorMessage,
            successNotification: entity.SuccessNotification,
            confirmEmailChangeTitleLabel: entity.ConfirmEmailChangeTitleLabel,
            confirmEmailChangeDescriptionLabel: entity.ConfirmEmailChangeDescriptionLabel,
            confirmEmailChangeTitleExpiredLabel: entity.ConfirmEmailChangeTitleExpiredLabel,
            confirmEmailChangeDescriptionExpiredLabel: entity.ConfirmEmailChangeDescriptionExpiredLabel,
            sendActivationLink: entity.SendActivationLink,
            sendAgainActivationLink: entity.SendAgainActivationLink,
            sendConfirmationLinkSuccessTitle: entity.SendConfirmationLinkSuccessTitle,
            sendConfirmationLinkSuccessMessage: entity.SendConfirmationLinkSuccessMessage,
            confirmEmailChangeTitleErrorLabel: entity.ConfirmEmailChangeTitleErrorLabel,
            confirmEmailChangeDescriptionErrorLabel: entity.ConfirmEmailChangeDescriptionErrorLabel,
            editProfileLink: entity.EditProfileLinkLabel
        },
        viewMode: entity.ViewMode,
        editModeAction: entity.EditModeAction,
        readEditModeAction: entity.ReadEditModeAction,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass,
        webserviceApiKey: widgetContext.requestContext.webserviceApiKey,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(widgetContext)
    };
}
