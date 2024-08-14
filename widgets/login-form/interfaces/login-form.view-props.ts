import { ExternalProvider } from '../../../rest-sdk/dto/external-provider';
import { ViewPropsBase } from '../../common/view-props-base';
import { LoginFormEntity } from '../login-form.entity';

export interface LoginFormViewProps<T extends LoginFormEntity> extends ViewPropsBase<T> {
    loginHandlerPath: string;
    rememberMe: boolean;
    membershipProviderName?: string;
    externalProviders?: ExternalProvider[];
    invalidClass: string;
    visibilityClasses: { [key: string]: string };
    redirectUrl?: string;
    forgottenPasswordLink?: string;
    registrationLink?: string;
    labels: {
        emailLabel: string,
        errorMessage: string,
        externalProvidersHeader: string,
        forgottenPasswordLinkLabel: string,
        header: string,
        notRegisteredLabel: string,
        passwordLabel: string,
        registerLinkText: string,
        rememberMeLabel: string,
        submitButtonLabel: string,
        validationInvalidEmailMessage: string,
        validationRequiredMessage: string
     };
};
