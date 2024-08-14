import { ForgottenPasswordFormClient } from './forgotten-password-form.client';
import { ResetPasswordViewProps } from './interfaces/reset-password.view-props';
import { ResetPasswordFormClient } from './reset-password-form.client';
import { ResetPasswordEntity } from './reset-password.entity';

export function ResetPasswordDefaultTemplate(props: ResetPasswordViewProps<ResetPasswordEntity>) {
    const labels = props.labels!;

    return (
      <>
        <div {...props.attributes}>
          {props.isResetPasswordRequest ?
            <div data-sf-role="sf-reset-password-container">
              {props.error || (props.requiresQuestionAndAnswer && !props.securityQuestion) ?
                <>
                  <h2>{labels.resetPasswordHeader}</h2>
                  <div data-sf-role="error-message-container" className="alert alert-danger" role="alert" aria-live="assertive">{labels.errorMessage}</div>
                </>
                  :
                <ResetPasswordFormClient {...props} />
                }
            </div>
          : <div data-sf-role="sf-forgotten-password-container">
            <h2 className="mb-3">{labels.forgottenPasswordHeader}</h2>
            <ForgottenPasswordFormClient {...props} />
            {props.loginPageUrl &&
              <a href={props.loginPageUrl} className="text-decoration-none">{labels.backLinkLabel}</a>
            }
          </div>
          }
        </div>
      </>
    );
}
