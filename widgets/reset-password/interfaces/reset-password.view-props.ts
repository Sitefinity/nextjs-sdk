import { ViewPropsBase } from '../../common/view-props-base';
import { ResetPasswordEntity } from '../reset-password.entity';

export interface ResetPasswordViewProps<T extends ResetPasswordEntity> extends ViewPropsBase<T> {
    resetUserPasswordHandlerPath: string;
    sendResetPasswordEmailHandlerPath: string;
    loginPageUrl?: string;
    registrationPageUrl?: string;
    invalidClass: string;
    visibilityClasses: { [key: string]: string };
    error?: true;
    securityQuestion?: string;
    requiresQuestionAndAnswer?: boolean;
    resetPasswordUrl?: string;
    securityToken?: string;
    membershipProviderName?: string;
    labels: {
        resetPasswordHeader: string;
        newPasswordLabel: string;
        repeatNewPasswordLabel: string;
        securityQuestionLabel: string;
        saveButtonLabel: string;
        successMessage: string;
        errorMessage: string;
        allFieldsAreRequiredErrorMessage: string;
        passwordsMismatchErrorMessage: string;
        forgottenPasswordHeader: string;
        emailLabel: string;
        forgottenPasswordLinkMessage: string;
        forgottenPasswordSubmitMessage: string;
        sendButtonLabel: string;
        backLinkLabel: string;
        forgottenPasswordLabel: string;
        invalidEmailFormatMessage: string;
        fieldIsRequiredMessage: string;
    };
    webserviceApiKey?: string;
}
