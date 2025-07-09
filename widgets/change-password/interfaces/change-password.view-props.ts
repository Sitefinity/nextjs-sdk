import { ViewPropsBase } from '../../common/view-props-base';
import { ChangePasswordEntity } from '../change-password.entity';

export interface ChangePasswordViewProps<T extends ChangePasswordEntity> extends ViewPropsBase<T> {
    changePasswordHandlerPath: string;
    labels: {
        header?: string;
        oldPassword?: string;
        newPassword?: string;
        repeatPassword?: string;
        submitButtonLabel?: string;
        loginFirstMessage?: string;
        validationRequiredMessage?: string;
        validationMismatchMessage?: string;
        externalProviderMessageFormat?: string;
    };
    visibilityClasses: {[key: string]: string;};
    invalidClass: string;
    postPasswordChangeAction?: string;
    externalProviderName?: string;
    redirectUrl?: string;
    postPasswordChangeMessage?: string;
    isLive: boolean;
    webserviceApiKey?: string;
}
