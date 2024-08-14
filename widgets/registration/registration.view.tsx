import { RegistrationViewProps } from './interfaces/registration.view-props';
import { RegistrationFormClient } from './registration-form.client';
import { RegistrationEntity } from './registration.entity';

export function RegistrationDefaultView(props: RegistrationViewProps<RegistrationEntity>) {
    const context = props.widgetContext.requestContext;

    const labels = props.labels;
    const showSuccessMessage = context?.searchParams?.showSuccessMessage?.toLowerCase() === 'true';

    const formContainerServer = (<>
      <input type="hidden" name="RedirectUrl" defaultValue={props.redirectUrl} />
      <input type="hidden" name="PostRegistrationAction" defaultValue={props.postRegistrationAction} />
      <input type="hidden" name="ActivationMethod" defaultValue={props.activationMethod} />
      <input type="hidden" name="ValidationRequiredMessage" value={labels.validationRequiredMessage} />
      <input type="hidden" name="ValidationMismatchMessage" value={labels.validationMismatchMessage} />
      <input type="hidden" name="ValidationInvalidEmailMessage" value={labels.validationInvalidEmailMessage} />
    </>);

    const confirmServer = (<>
      <input type="hidden" name="ResendConfirmationEmailUrl" value={props.resendConfirmationEmailHandlerPath} />
      <input type="hidden" name="ActivationLinkLabel" value={labels.activationLinkLabel} />
      <input type="hidden" name="SendAgainLink" value={labels.sendAgainLink} />
      <input type="hidden" name="SendAgainLabel" value={labels.sendAgainLabel} />
    </>);

    return (
      <>
        <div
          {...props.attributes}
          >
          {props.isAccountActivationRequest && <h2 className="mb-3">
              {labels.activationMessage}
          </h2>
          }
          {!props.isAccountActivationRequest && (<>
            {showSuccessMessage && <h3>{labels.successHeader}</h3>}
            {showSuccessMessage && <p>{labels.successLabel}</p>}
            {
              !showSuccessMessage &&
              <>

                <RegistrationFormClient
                  action={props.registrationHandlerPath}
                  viewProps={props}
                  formContainerServer={formContainerServer}
                  confirmServer={confirmServer}
                   />
              </>
            }
            </>)
          }
        </div>
      </>
    );
}
