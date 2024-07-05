import { Attributes } from '../../../typings/attributes';

export interface ResetPasswordFormViewModel {
    ResetUserPasswordHandlerPath: string;
    SendResetPasswordEmailHandlerPath: string;
    LoginPageUrl?: string;
    InvalidClass: string;
    VisibilityClasses: { [key: string]: string };
    Attributes?: Attributes;
    IsResetPasswordRequest?: boolean;
    Error?: true;
    SecurityQuestion?: string;
    RequiresQuestionAndAnswer?: boolean;
    ResetPasswordUrl?: string;
    SecurityToken?: string;

    Labels: {
        ResetPasswordHeader: string;
        NewPasswordLabel: string;
        RepeatNewPasswordLabel: string;
        SecurityQuestionLabel: string;
        SaveButtonLabel: string;
        SuccessMessage: string;
        ErrorMessage: string;
        AllFieldsAreRequiredErrorMessage: string;
        PasswordsMismatchErrorMessage: string;
        ForgottenPasswordHeader: string;
        EmailLabel: string;
        ForgottenPasswordLinkMessage: string;
        ForgottenPasswordSubmitMessage: string;
        SendButtonLabel: string;
        BackLinkLabel: string;
        ForgottenPasswordLabel: string;
        InvalidEmailFormatMessage: string;
        FieldIsRequiredMessage: string;
    }
}
