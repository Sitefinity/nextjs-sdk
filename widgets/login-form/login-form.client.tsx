'use client';

import React, { useEffect } from 'react';
import { VisibilityStyle } from '../styling/visibility-style';
import { ExternalLoginBase, ExternalProviderData } from '../external-login-base';
import { classNames } from '../../editor/utils/classNames';
import { LoginFormViewProps } from './interfaces/login-form.view-props';
import { SecurityService } from '../../services/security-service';
import { LoginFormEntity } from './login-form.entity';
import { useSearchParams } from 'next/navigation';
import { getQueryParams } from '../common/query-params';
import { getUniqueId } from '../../editor/utils/getUniqueId';

const invalidDataAttr = 'data-sf-invalid';
const isValidEmail = function (email: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(email);
};

export function LoginFormClient(props: LoginFormViewProps<LoginFormEntity>) {
    const searchParams = useSearchParams();
    const usernameInputId = getUniqueId('sf-username-', props.widgetContext.model.Id);
    const passwordInputId = getUniqueId('sf-password-', props.widgetContext.model.Id);
    const rememberInputId = getUniqueId('sf-remember-', props.widgetContext.model.Id);
    const labels = props.labels;
    const visibilityClassHidden = props.visibilityClasses[VisibilityStyle.Hidden];
    const returnUrl = ExternalLoginBase.GetDefaultReturnUrl(getQueryParams(searchParams), { redirectUrl: props.redirectUrl });
    const returnErrorUrl = ExternalLoginBase.GetDefaultReturnUrl(getQueryParams(searchParams), { isError: true, shouldEncode: false });
    const passResetColumnSize = props.rememberMe ? 'col-md-6 text-end' : 'col-12';

    const formRef = React.useRef<HTMLFormElement>(null);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const [invalidInputs, setInvalidInputs] = React.useState<{[key: string]: boolean | undefined;}>({});
    const [showErrorMessage, setShowErrorMessage] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>(labels.errorMessage);
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
      const externalProviderData: ExternalProviderData[] = props.externalProviders?.map(provider => {
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
            setErrorMessage(labels.validationRequiredMessage);
            setShowErrorMessage(true);
            setInvalidInputs(emptyInputs);

            return isValid;
        }

        let emailInput = emailInputRef.current!;
        if (!isValidEmail(emailInput.value)) {
            setErrorMessage(labels.validationInvalidEmailMessage);
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
                [props.invalidClass]: invalidInputs[name]
                }
            ),
            [invalidDataAttr]: invalidInputs[name],
            name: name
        };
    };

    return (<>
      <div data-sf-role="form-container">
        <h2 className="mb-3">{labels.header}</h2>
        <div id="errorContainer"
          className={classNames('alert alert-danger my-3',{
                    ['d-block']: ExternalLoginBase.isError(getQueryParams(searchParams)) || showErrorMessage,
                    [visibilityClassHidden]: !(ExternalLoginBase.isError(getQueryParams(searchParams)) || showErrorMessage)
                })}
          role="alert" aria-live="assertive" data-sf-role="error-message-container">
          {errorMessage}
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          action={props.loginHandlerPath} method="post" role="form" noValidate={true}>
          <div className="mb-3">
            <label htmlFor={usernameInputId} className="form-label">{labels.emailLabel}</label>
            <input type="email" ref={emailInputRef}
              id={usernameInputId} data-sf-role="required"
              {...inputValidationAttrs('username')}/>
          </div>

          <div className="mb-3">
            <label htmlFor={passwordInputId} className="form-label">{labels.passwordLabel}</label>
            <input type="password"
              id={passwordInputId} data-sf-role="required"
              {...inputValidationAttrs('password')}/>
          </div>
          {(props.rememberMe || props.forgottenPasswordLink) &&
          <div className="row mb-3">
            {props.rememberMe &&
            <div className="checkbox col-md-6 m-0">
              <label>
                <input defaultChecked={props.rememberMe} data-val="true"
                  data-val-required="The RememberMe field is required." id={rememberInputId}
                  name="RememberMe" type="checkbox" defaultValue={`${props.rememberMe}`} />
                <label htmlFor={rememberInputId}>{labels.rememberMeLabel}</label>
              </label>
            </div>
            }
            {props.forgottenPasswordLink &&
            <div className={passResetColumnSize}>
              <a href={props.forgottenPasswordLink}
                className="text-decoration-none">{labels.forgottenPasswordLinkLabel}</a>
            </div>
            }
          </div>
        }
          <input type="hidden" name="RedirectUrl" value={returnUrl} />
          <input type="hidden" name="ErrorRedirectUrl" value={returnErrorUrl} />
          <input type="hidden" name="MembershipProviderName" value={props.membershipProviderName || ''} />
          <input type="hidden" value="" name="sf_antiforgery" />
          <input className="btn btn-primary w-100" type="submit" value={labels.submitButtonLabel || ''} />
          { props.rememberMe && <input name="RememberMe" type="hidden" value="false" /> }
        </form>
        <input type="hidden" name="ValidationInvalidEmailMessage" value={labels.validationInvalidEmailMessage || ''} />
        <input type="hidden" name="ValidationRequiredMessage" value={labels.validationRequiredMessage || ''} />
      </div>
      {props.registrationLink &&
      <div className="row mt-3">
        <div className="col-md-6">{labels.notRegisteredLabel}</div>
        <div className="col-md-6 text-end"><a href={props.registrationLink}
          className="text-decoration-none">{labels.registerLinkText}</a></div>
      </div>
      }
      {externalProvidersData.length > 0 &&
      (<>
        <h3 className="mt-3">{labels.externalProvidersHeader}</h3>
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
