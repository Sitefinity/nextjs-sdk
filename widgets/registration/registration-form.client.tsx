'use client';

import React, { useEffect } from 'react';
import { VisibilityStyle } from '../styling/visibility-style';
import { invalidDataAttr, isValidEmail, serializeForm, SF_WEBSERVICE_API_KEY_HEADER } from '../common/utils';
import { classNames } from '../../editor/utils/classNames';
import { getQueryParams } from '../common/query-params';
import { useSearchParams } from 'next/navigation';
import { RegistrationFormProps } from './interfaces/registration-form-props';
import { SecurityService } from '../../services/security-service';
import { ExternalLoginBase, ExternalProviderData } from '../external-login-base';
import { getUniqueId } from '../../editor/utils/getUniqueId';

export function RegistrationFormClient(props: RegistrationFormProps) {
    const searchParams = useSearchParams();
    const viewProps = { ...props.viewProps };

    const context = viewProps.widgetContext.requestContext;

    const firstNameInputId = getUniqueId('sf-first-name-', viewProps.widgetContext.model.Id);
    const lastNameInputId = getUniqueId('sf-last-name-', viewProps.widgetContext.model.Id);
    const emailInputId = getUniqueId('sf-email-', viewProps.widgetContext.model.Id);
    const passwordInputId = getUniqueId('sf-new-password-', viewProps.widgetContext.model.Id);
    const repeatPasswordInputId = getUniqueId('sf-repeat-password-', viewProps.widgetContext.model.Id);
    const questionInputId = getUniqueId('sf-secret-question-', viewProps.widgetContext.model.Id);
    const answerInputId = getUniqueId('sf-secret-answer-', viewProps.widgetContext.model.Id);

    const labels = viewProps.labels;
    const visibilityClassHidden = viewProps.visibilityClasses![VisibilityStyle.Hidden];
    const formRef = React.useRef<HTMLFormElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const repeatPasswordInputRef = React.useRef<HTMLInputElement>(null);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const [invalidInputs, setInvalidInputs] = React.useState<{[key: string]: boolean | undefined;}>({});
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [showFormContainer, setShowFormContainer] = React.useState<boolean>(true);
    const [showSuccessRegistrationContainer, setSuccessRegistrationContainer] = React.useState<boolean>(false);
    const [showSuccessContainer, setSuccessContainer] = React.useState<boolean>(false);
    const [activationLinkMessage, setActivationLinkMessage] = React.useState<string>('');
    const [externalProvidersData, setExternalProvidersData] = React.useState<ExternalProviderData[]>([]);

    useEffect(() => {
        const externalProviderData: ExternalProviderData[] = viewProps.externalProviders?.map(provider => {
          const providerClass = ExternalLoginBase.GetExternalLoginButtonCssClass(provider.Name);
          const externalLoginPath = ExternalLoginBase.GetExternalLoginPath(getQueryParams(searchParams), provider.Name);

          return {
            cssClass: providerClass,
            externalLoginPath: externalLoginPath,
            label: provider.Value
          };
        }) ?? [];

        setExternalProvidersData(externalProviderData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


    const postRegistrationAction = () => {
        let action = viewProps.postRegistrationAction;
        let activationMethod = viewProps.activationMethod;

        if (action === 'ViewMessage') {
            if (activationMethod === 'AfterConfirmation') {
                showSuccessAndConfirmationSentMessage();
            } else {
                showSuccessMessage();
            }
        } else if (action === 'RedirectToPage') {
            let redirectUrl = viewProps.redirectUrl;

            window.location = (redirectUrl as Location | (string & Location));
        }
    };

    const onRegistrationError = (errorMessage: string) => {
        setErrorMessage(errorMessage);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm(formRef.current!)) {
            return;
        }

        SecurityService.setAntiForgeryTokens().then(() => {
            submitFormHandler(formRef.current!, '', postRegistrationAction, onRegistrationError);
        }, () => {
            setErrorMessage('AntiForgery token retrieval failed');
        });
    };

    const submitFormHandler = (
        form: HTMLFormElement,
        url: RequestInfo | URL,
        onSuccess: ()=> void,
        onError?: (err: string)=> void
    ) => {
        url = url || (form.attributes as any)['action'].value;

        let model = { model: serializeForm(form) };

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (props.viewProps.webserviceApiKey) {
            headers[SF_WEBSERVICE_API_KEY_HEADER] = props.viewProps.webserviceApiKey;
        }

        window.fetch(url, {
            method: 'POST',
            body: JSON.stringify(model),
            headers
        }).then((response) => {
            let status = response.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                response.json().then((res) => {
                    let message = res.error.message;

                    if (onError) {
                        onError(message);
                    }
                });
            }
        });
    };

    const postResendAction = () => {
        const sendAgainLabel = labels.sendAgainLabel;
        const formData = new FormData(formRef.current!);
        const email = formData.get('Email')?.valueOf() as string;
        setActivationLinkMessage(sendAgainLabel.replace('{0}', email));
    };

    const invalidateElement = (emptyInputs: any, element: HTMLInputElement) => {
        if (element) {
            emptyInputs[element.name] = true;
        }
    };

    const validateForm = (form: HTMLFormElement) => {
        let isValid = true;
        setInvalidInputs({});
        const emptyInputs = {};

        let requiredInputs = form.querySelectorAll('input[data-sf-role=\'required\']');

        (requiredInputs as NodeListOf<HTMLInputElement>).forEach((input: HTMLInputElement) => {
            if (!input.value) {
                invalidateElement(emptyInputs, input);
                setInvalidInputs(emptyInputs);
                isValid = false;
            }
        });

        if (!isValid) {
            setErrorMessage(labels.validationRequiredMessage);
            return isValid;
        }

        let emailInput = emailInputRef.current!;
        if (!isValidEmail(emailInput.value)) {
            invalidateElement(emptyInputs, emailInput);
            setInvalidInputs(emptyInputs);
            setErrorMessage(labels.validationInvalidEmailMessage);
            return false;
        }

        if (passwordInputRef.current!.value !== repeatPasswordInputRef.current!.value) {
            invalidateElement(emptyInputs, repeatPasswordInputRef.current!);
            setInvalidInputs(emptyInputs);
            setErrorMessage(labels.validationMismatchMessage);

            return false;
        }

        return isValid;
    };

    const showSuccessMessage = () => {
        setErrorMessage('');
        setShowFormContainer(false);
        setSuccessRegistrationContainer(true);
    };

    const showSuccessAndConfirmationSentMessage = () => {
        setShowFormContainer(false);
        setSuccessContainer(true);

        const activationLinkLabel = labels.activationLinkLabel;
        const formData = new FormData(formRef.current!);
        const email = formData.get('Email');
        setActivationLinkMessage(`${activationLinkLabel} ${email}`);
    };

    const handleSendAgain = (event: React.MouseEvent<HTMLAnchorElement>) => {
        const resendUrl = viewProps.resendConfirmationEmailHandlerPath;

        event.preventDefault();
        submitFormHandler(formRef.current!, resendUrl, postResendAction);
    };

    const formContainerClass = classNames({
        [visibilityClassHidden]: !showFormContainer
    });
    const formContainerStyle = {
        display: !visibilityClassHidden ? showFormContainer ? '' : 'none' : ''
    };

    const errorMessageClass = classNames('alert alert-danger my-3', {
        [visibilityClassHidden]: !errorMessage
    });
    const errorMessageStyles = {
        display: !visibilityClassHidden ? errorMessage ? '' : 'none' : ''
    };

    const confirmContainerClass = classNames({
        [visibilityClassHidden]: !showSuccessContainer
    });
    const confirmContainerStyle = {
        display: !visibilityClassHidden ? showSuccessContainer ? '' : 'none' : ''
    };

    const successRegistrationContainerClass = classNames({
        [visibilityClassHidden]: !showSuccessRegistrationContainer
    });
    const successRegistrationContainerStyle = {
        display: !visibilityClassHidden ? showSuccessRegistrationContainer ? '' : 'none' : ''
    };

    const inputValidationAttrs = (name: string) => {
        return {
            className: classNames('form-control',{
                [viewProps.invalidClass!]: invalidInputs[name]
                }
            ),
            [invalidDataAttr]: invalidInputs[name],
            name: name
        };
    };

    if (context.isLive && !viewProps.activationPageUrl?.toUpperCase().startsWith('HTTP')) {
        viewProps.activationPageUrl = typeof window !== 'undefined' ? window.location.protocol + '//' + viewProps.activationPageUrl : '';
    }

    return (<>
      <div data-sf-role="form-container"
        className={formContainerClass}
        style={formContainerStyle}
      >
        <h2 className="mb-3">{labels.header}</h2>
        <div data-sf-role="error-message-container"
          className={errorMessageClass}
          style={errorMessageStyles}
          role="alert" aria-live="assertive">
          {errorMessage}
        </div>
        <form ref={formRef}
          role="form"
          noValidate={true}
          method="post"
          action={props.action}
          onSubmit={handleSubmit}
         >
          <div className="mb-3">
            <label htmlFor={firstNameInputId} className="form-label">{labels.firstNameLabel}</label>
            <input id={firstNameInputId} type="text"
              data-sf-role="required"
              {...inputValidationAttrs('FirstName')}/>
          </div>
          <div className="mb-3">
            <label htmlFor={lastNameInputId} className="form-label">{labels.lastNameLabel}</label>
            <input id={lastNameInputId} type="text"
              data-sf-role="required"
              {...inputValidationAttrs('LastName')}/>
          </div>
          <div className="mb-3">
            <label htmlFor={emailInputId} className="form-label">{labels.emailLabel}</label>
            <input ref={emailInputRef} id={emailInputId} type="email"
              data-sf-role="required"
              {...inputValidationAttrs('Email')}/>
          </div>
          <div className="mb-3">
            <label htmlFor={passwordInputId} className="form-label">{labels.passwordLabel}</label>
            <input ref={passwordInputRef} id={passwordInputId} type="password"
              data-sf-role="required"
              {...inputValidationAttrs('Password')}/>
          </div>
          <div className="mb-3">
            <label htmlFor={repeatPasswordInputId} className="form-label">{labels.repeatPasswordLabel}</label>
            <input ref={repeatPasswordInputRef} id={repeatPasswordInputId} type="password"
              data-sf-role="required"
              {...inputValidationAttrs('RepeatPassword')}/>
          </div>

          {viewProps.requiresQuestionAndAnswer &&
          <div className="mb-3">
            <label htmlFor={questionInputId} className="form-label">{labels.secretQuestionLabel}</label>
            <input id={questionInputId} type="text"
              data-sf-role="required"
              {...inputValidationAttrs('Question')} />
          </div>
          }
          {viewProps.requiresQuestionAndAnswer &&
          <div className="mb-3">
            <label htmlFor={answerInputId} className="form-label">{labels.secretAnswerLabel}</label>
            <input id={answerInputId} type="text"
              data-sf-role="required"
              {...inputValidationAttrs('Answer')} />
          </div>
          }
          <input className="btn btn-primary w-100" type="submit" value={labels.registerButtonLabel} />
          <input type="hidden" name="ActivationPageUrl" defaultValue={viewProps.activationPageUrl} />
          <input type="hidden" value="" name="sf_antiforgery" />
        </form>
        {viewProps.loginPageUrl && <div className="mt-3">{labels.loginLabel}</div>}
        {viewProps.loginPageUrl && <a href={viewProps.loginPageUrl} className="text-decoration-none">{labels.loginLink}</a>}
        {externalProvidersData.length > 0 &&
        (<>
          <h3 className="mt-3">{labels.externalProvidersHeader}</h3>
            { externalProvidersData.map((providerData: ExternalProviderData, idx: number) => {
                return (
                  <a key={idx} className={classNames('btn border fs-5 w-100 mt-2', providerData.cssClass)} href={providerData.externalLoginPath} data-sf-test="extPrv">
                    {providerData.label}
                  </a>
                );
            })
            }
        </>)
        }
        <>
          <input type="hidden" name="RedirectUrl" defaultValue={viewProps.redirectUrl} />
          <input type="hidden" name="PostRegistrationAction" defaultValue={viewProps.postRegistrationAction} />
          <input type="hidden" name="ActivationMethod" defaultValue={viewProps.activationMethod} />
          <input type="hidden" name="ValidationRequiredMessage" value={labels.validationRequiredMessage} />
          <input type="hidden" name="ValidationMismatchMessage" value={labels.validationMismatchMessage} />
          <input type="hidden" name="ValidationInvalidEmailMessage" value={labels.validationInvalidEmailMessage} />
        </>
      </div>
      <div data-sf-role="success-registration-message-container"
        className={successRegistrationContainerClass}
        style={successRegistrationContainerStyle}>
        <h3>{labels.successHeader}</h3>
        <p>{labels.successLabel}</p>
      </div>

      <div data-sf-role="confirm-registration-message-container"
        className={confirmContainerClass}
        style={confirmContainerStyle}
      >
        <h3>{labels.activationLinkHeader}</h3>
        <p data-sf-role="activation-link-message-container" >
          {activationLinkMessage}
        </p>
        <a data-sf-role="sendAgainLink" onClick={handleSendAgain} className="btn btn-primary">
          {labels.sendAgainLink}
        </a>
        <>
          <input type="hidden" name="ResendConfirmationEmailUrl" value={viewProps.resendConfirmationEmailHandlerPath} />
          <input type="hidden" name="ActivationLinkLabel" value={labels.activationLinkLabel} />
          <input type="hidden" name="SendAgainLink" value={labels.sendAgainLink} />
          <input type="hidden" name="SendAgainLabel" value={labels.sendAgainLabel} />
        </>
      </div>
    </>);
};
