import { Attributes } from '../../../typings/attributes';

export interface ChangePasswordViewModel {
    ChangePasswordHandlerPath: string;
    Attributes?: Attributes;
    Labels: {
        Header?: string;
        OldPassword?: string;
        NewPassword?: string;
        RepeatPassword?: string;
        SubmitButtonLabel?: string;
        LoginFirstMessage?: string;
        ValidationRequiredMessage?: string;
        ValidationMismatchMessage?: string;
        ExternalProviderMessageFormat?: string;
    };
    VisibilityClasses: {[key: string]: string;};
    InvalidClass: string;
    PostPasswordChangeAction?: string;
    ExternalProviderName?: string;
    RedirectUrl?: string;
    PostPasswordChangeMessage?: string;
    IsLive: boolean;
}
