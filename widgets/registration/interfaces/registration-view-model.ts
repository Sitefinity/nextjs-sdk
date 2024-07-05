import { ExternalProvider } from '../../../rest-sdk/dto/external-provider';
import { Attributes } from '../../../typings/attributes';
import { PostRegistrationAction } from './post-registration-action';

export interface RegistrationViewModel {
    RegistrationHandlerPath: string;
    ResendConfirmationEmailHandlerPath: string;
    ExternalLoginHandlerPath: string;
    Attributes: Attributes;
    Labels : {
        Header: string;
        FirstNameLabel: string;
        LastNameLabel: string;
        EmailLabel: string;
        PasswordLabel: string;
        RepeatPasswordLabel: string;
        SecretQuestionLabel: string;
        SecretAnswerLabel: string;
        RegisterButtonLabel: string;
        ActivationLinkHeader: string;
        ActivationLinkLabel: string;
        SendAgainLink: string;
        SendAgainLabel: string;
        SuccessHeader: string;
        SuccessLabel: string;
        LoginLabel: string;
        LoginLink: string;
        ExternalProvidersHeader: string;
        ValidationRequiredMessage: string;
        ValidationMismatchMessage: string;
        ValidationInvalidEmailMessage: string;
        ActivationMessage?: string;
    };
    ExternalProviders?: ExternalProvider[];
    LoginPageUrl?: string;
    IsAccountActivationRequest?: boolean;
    RedirectUrl?: string;
    PostRegistrationAction?: PostRegistrationAction;
    ActivationPageUrl?: string;
    ActivationMethod?: string;
    RequiresQuestionAndAnswer?: boolean;
    VisibilityClasses?: {[key: string]: string};
    InvalidClass?: string;
    Warning?: string;
}
