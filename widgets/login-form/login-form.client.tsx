'use client';

import React, { useEffect } from 'react';
import { VisibilityStyle } from '../styling/visibility-style';
import { ExternalLoginBase, ExternalProviderData } from '../external-login-base';
import { classNames } from '../../editor/utils/classNames';
import { RequestContext } from '../../editor/request-context';
import { LoginFormViewModel } from './interfaces/login-form-view-model';
import { SecurityService } from '../../services/security-service';

export interface LoginFormContainerProps {
    viewModel: LoginFormViewModel,
    context: RequestContext,
    usernameInputId: string,
    passwordInputId: string,
    rememberInputId: string
}

const invalidDataAttr = 'data-sf-invalid';
const isValidEmail = function (email: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(email);
};

export function LoginFormClient(props: LoginFormContainerProps) {
    const { viewModel, context, usernameInputId, passwordInputId, rememberInputId } = props;
    const labels = viewModel.Labels;
    const visibilityClassHidden = viewModel.VisibilityClasses[VisibilityStyle.Hidden];
    const returnUrl = ExternalLoginBase.GetDefaultReturnUrl(context, { redirectUrl: viewModel.RedirectUrl });
    const returnErrorUrl = ExternalLoginBase.GetDefaultReturnUrl(context, { redirectUrl: viewModel.RedirectUrl, isError: true, shouldEncode: false });
    const passResetColumnSize = viewModel.RememberMe ? 'col-md-6 text-end' : 'col-12';

    const formRef = React.useRef<HTMLFormElement>(null);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const [invalidInputs, setInvalidInputs] = React.useState<{[key: string]: boolean | undefined;}>({});
    const [showErrorMessage, setShowErrorMessage] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>(labels.ErrorMessage);
    const [externalProvidersData, setExternalProvidersData] = React.useState<ExternalProviderData[]>([]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm(formRef.current!)) {
          return;
        }

        SecurityService.setAntiForgeryTokens().then(() => {
          (event.target as HTMLFormElement).submit();
        }, () => {
            showError('AntiForgery token retrieval failed');
        });
    };

    useEffect(() => {
      const externalProviderData: ExternalProviderData[] = viewModel.ExternalProviders?.map(provider => {
        const providerClass = ExternalLoginBase.GetExternalLoginButtonCssClass(provider.Name);
        const externalLoginPath = ExternalLoginBase.GetExternalLoginPath(context, provider.Name);

        return {
          cssClass: providerClass,
          externalLoginPath: externalLoginPath,
          label: provider.Value
        };
      }) ?? [];

      setExternalProvidersData(externalProviderData);
    },[context, viewModel.ExternalProviders]);

    const validateForm = (form: HTMLFormElement) => {
        let isValid = true;
        setInvalidInputs({});
        setShowErrorMessage(false);

        let requiredInputs = form.querySelectorAll('input[data-sf-role=\'required\']');
        const emptyInputs = {};
        (requiredInputs as NodeListOf<HTMLInputElement>).forEach((input: HTMLInputElement) => {
            if (!input.value) {
                invalidateElement(emptyInputs, input);
                isValid = false;
            }
        });

        if (!isValid) {
            setErrorMessage(labels.ValidationRequiredMessage);
            setShowErrorMessage(true);
            setInvalidInputs(emptyInputs);

            return isValid;
        }

        let emailInput = emailInputRef.current!;
        if (!isValidEmail(emailInput.value)) {
            setErrorMessage(labels.ValidationInvalidEmailMessage);
            invalidateElement(emptyInputs, emailInput);
            setShowErrorMessage(true);
            setInvalidInputs(emptyInputs);

            return false;
        }

        return isValid;
    };

    const invalidateElement = (emptyInputs: any, element: HTMLInputElement) => {
        if (element) {
            emptyInputs[element.name] = true;
        }
    };

    const showError = (err: string) => {
        setErrorMessage(err);
    };

    const inputValidationAttrs = (name: string) => {
        return {
            className: classNames('form-control',{
                [viewModel.InvalidClass]: invalidInputs[name]
                }
            ),
            [invalidDataAttr]: invalidInputs[name],
            name: name
        };
    };

    return (<>
      <div data-sf-role="form-container">
        <h2 className="mb-3">{labels.Header}</h2>
        <div id="errorContainer"
          className={classNames('alert alert-danger my-3',{
                    ['d-block']: ExternalLoginBase.isError(context) || showErrorMessage,
                    [visibilityClassHidden]: !(ExternalLoginBase.isError(context) || showErrorMessage)
                })}
          role="alert" aria-live="assertive" data-sf-role="error-message-container">
          {errorMessage}
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          action={viewModel.LoginHandlerPath} method="post" role="form" noValidate={true}>
          <div className="mb-3">
            <label htmlFor={usernameInputId} className="form-label">{labels.EmailLabel}</label>
            <input type="email" ref={emailInputRef}
              id={usernameInputId} data-sf-role="required"
              {...inputValidationAttrs('username')}/>
          </div>

          <div className="mb-3">
            <label htmlFor={passwordInputId} className="form-label">{labels.PasswordLabel}</label>
            <input type="password"
              id={passwordInputId} data-sf-role="required"
              {...inputValidationAttrs('password')}/>
          </div>
          {(viewModel.RememberMe || viewModel.ForgottenPasswordLink) &&
          <div className="row mb-3">
            {viewModel.RememberMe &&
            <div className="checkbox col-md-6 m-0">
              <label>
                <input defaultChecked={viewModel.RememberMe} data-val="true"
                  data-val-required="The RememberMe field is required." id={rememberInputId}
                  name="RememberMe" type="checkbox" defaultValue={`${viewModel.RememberMe}`} />
                <label htmlFor={rememberInputId}>{labels.RememberMeLabel}</label>
              </label>
            </div>
            }
            {viewModel.ForgottenPasswordLink &&
            <div className={passResetColumnSize}>
              <a href={viewModel.ForgottenPasswordLink}
                className="text-decoration-none">{labels.ForgottenPasswordLinkLabel}</a>
            </div>
            }
          </div>
        }
          <input type="hidden" name="RedirectUrl" value={returnUrl} />
          <input type="hidden" name="ErrorRedirectUrl" value={returnErrorUrl} />
          <input type="hidden" name="MembershipProviderName" value={viewModel.MembershipProviderName || ''} />
          <input type="hidden" value="" name="sf_antiforgery" />
          <input className="btn btn-primary w-100" type="submit" value={labels.SubmitButtonLabel || ''} />
          { viewModel.RememberMe && <input name="RememberMe" type="hidden" value="false" /> }
        </form>
        <input type="hidden" name="ValidationInvalidEmailMessage" value={labels.ValidationInvalidEmailMessage || ''} />
        <input type="hidden" name="ValidationRequiredMessage" value={labels.ValidationRequiredMessage || ''} />
      </div>
      {viewModel.RegistrationLink &&
      <div className="row mt-3">
        <div className="col-md-6">{labels.NotRegisteredLabel}</div>
        <div className="col-md-6 text-end"><a href={viewModel.RegistrationLink}
          className="text-decoration-none">{labels.RegisterLinkText}</a></div>
      </div>
      }
      {externalProvidersData.length > 0 &&
      (<>
        <h3 className="mt-3">{labels.ExternalProvidersHeader}</h3>
        { externalProvidersData.map((providerData: ExternalProviderData, idx: number) => {
            return (
              <a key={idx} className={classNames('btn border fs-5 w-100 mt-2', providerData.cssClass)} href={providerData.externalLoginPath}>
                {providerData.label}
              </a>
            );
          })
        }
        </>)
      }
    </>);
};
