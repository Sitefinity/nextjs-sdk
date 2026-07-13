import { ExternalProvider } from '../../../rest-sdk/dto/external-provider';
import { ViewPropsBase } from '../../common/view-props-base';
import { RegistrationEntity } from '../registration.entity';
import { PostRegistrationAction } from './post-registration-action';

export interface RegistrationViewProps<T extends RegistrationEntity> extends ViewPropsBase<T> {
    registrationHandlerPath: string;
    resendConfirmationEmailHandlerPath: string;
    externalLoginHandlerPath: string;
    labels : {
        header: string;
        firstNameLabel: string;
        lastNameLabel: string;
        emailLabel: string;
        passwordLabel: string;
        repeatPasswordLabel: string;
        secretQuestionLabel: string;
        secretAnswerLabel: string;
        registerButtonLabel: string;
        activationLinkHeader: string;
        activationLinkLabel: string;
        activationExpiredHeader: string;
        activationExpiredLabel: string;
        activationExpiredBtnText: string;
        sendAgainLink: string;
        sendAgainLabel: string;
        successHeader: string;
        successLabel: string;
        loginLabel: string;
        loginLink: string;
        externalProvidersHeader: string;
        validationRequiredMessage: string;
        validationMismatchMessage: string;
        validationInvalidEmailMessage: string;
    };
    email?: string;
    externalProviders?: ExternalProvider[];
    loginPageUrl?: string;
    redirectUrl?: string;
    postRegistrationAction?: PostRegistrationAction;
    activationPageUrl?: string;
    activationMethod?: string;
    requiresQuestionAndAnswer?: boolean;
    visibilityClasses?: {[key: string]: string};
    invalidClass?: string;
}
