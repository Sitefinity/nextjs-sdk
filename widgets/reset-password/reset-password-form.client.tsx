'use client';

import React from 'react';
import { VisibilityStyle } from '../styling/visibility-style';
import { invalidDataAttr, invalidateElement, serializeForm } from '../common/utils';
import { classNames } from '../../editor/utils/classNames';
import { ResetPasswordViewProps } from './interfaces/reset-password.view-props';
import { ResetPasswordEntity } from './reset-password.entity';
import { getUniqueId } from '../../editor/utils/getUniqueId';

export function ResetPasswordFormClient (props: ResetPasswordViewProps<ResetPasswordEntity>) {
    const securityQuestionInputId = getUniqueId('sf-security-question-', props.widgetContext.model.Id);
    const newPasswordInputId = getUniqueId('sf-new-password-', props.widgetContext.model.Id);
    const repeatPasswordInputId = getUniqueId('sf-repeat-password-', props.widgetContext.model.Id);

    const formRef = React.useRef<HTMLFormElement>(null);
    const newPasswordInputRef = React.useRef<HTMLInputElement>(null);
    const repeatPasswordInputRef = React.useRef<HTMLInputElement>(null);
    const securityQuestionInputRef = React.useRef<HTMLInputElement>(null);
    const labels = props.labels;
    const visibilityClassHidden = props.visibilityClasses[VisibilityStyle.Hidden];
    const [invalidInputs, setInvalidInputs] = React.useState<{[key: string]: boolean | undefined;}>({});
    const [showFormContainer, setShowFormContainer] = React.useState<boolean>(true);
    const [showSuccessContainer, setShowSuccessContainer] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm(formRef.current!)) {
            return;
        }

        let model = { model: serializeForm(formRef.current!) };
        let submitUrl = (formRef.current!.attributes as any)['action'].value;
        window.fetch(
            submitUrl,
            {
                method: 'POST',
                body: JSON.stringify(model),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                let status = response.status;
                if (status === 204) {
                    setShowFormContainer(false);
                    setShowSuccessContainer(true);
                } else {
                    let invalidInput;
                    const emptyInputs = {};
                    if (status === 400) {
                        invalidInput = newPasswordInputRef.current!;
                    } else if (status === 403) {
                        invalidInput = securityQuestionInputRef.current!;
                    }

                    invalidateElement(emptyInputs, invalidInput!);
                    setInvalidInputs(emptyInputs);

                    response.json().then((res) => {
                        let errorMessage = res.error.message;
                        setErrorMessage(errorMessage);
                    });
                }
            });
    };

    const validateForm = (form: HTMLFormElement) => {
        let isValid = true;
        setInvalidInputs({});
        setErrorMessage('');
        const emptyInputs = {};

        const requiredInputs = form.querySelectorAll('input[data-sf-role=\'required\']');

        (requiredInputs as NodeListOf<HTMLInputElement>).forEach((input: HTMLInputElement) => {
            if (!input.value) {
                invalidateElement(emptyInputs, input);
                setInvalidInputs(emptyInputs);
                isValid = false;
            }
        });

        if (!isValid) {
            setErrorMessage(labels.allFieldsAreRequiredErrorMessage);

            return isValid;
        }

        if (newPasswordInputRef.current!.value !== repeatPasswordInputRef.current!.value) {
            invalidateElement(emptyInputs, repeatPasswordInputRef.current!);
            setInvalidInputs(emptyInputs);
            setErrorMessage(labels.passwordsMismatchErrorMessage);

            return false;
        }

        return isValid;
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

    const successContainerClass = classNames({
        [visibilityClassHidden]: !showSuccessContainer
      });
    const successContainerStyle = {
        display: !visibilityClassHidden ? showSuccessContainer ? '' : 'none' : ''
    };

    return (<>
      <div data-sf-role="form-container"
        className={formContainerClass}
        style={formContainerStyle}
      >
        <h2 className="mb-3">{labels.resetPasswordHeader}</h2>
        {<div data-sf-role="error-message-container"
          className={errorMessageClass}
          style={errorMessageStyles}
          role="alert" aria-live="assertive">
          {errorMessage}
        </div>
        }
        <form ref={formRef} onSubmit={handleSubmit} method="post" action={props.resetUserPasswordHandlerPath} role="form">
          {props.requiresQuestionAndAnswer && props.securityQuestion &&
          <div className="mb-3">
            <label htmlFor={securityQuestionInputId} className="form-label">
              {!labels.securityQuestionLabel ? props.securityQuestion : `${labels.securityQuestionLabel} ${props.securityQuestion}`}
            </label>
            <input ref={securityQuestionInputRef} id={securityQuestionInputId} type="text"
              data-sf-role="required"
              {...inputValidationAttrs('Answer')}/>
          </div>
                        }
          <div className="mb-3">
            <label htmlFor={newPasswordInputId} className="form-label">{labels.newPasswordLabel}</label>
            <input ref={newPasswordInputRef} id={newPasswordInputId} type="password"
              data-sf-role="required"
              {...inputValidationAttrs('NewPassword')}/>
          </div>
          <div className="mb-3">
            <label htmlFor={repeatPasswordInputId} className="form-label">{labels.repeatNewPasswordLabel}</label>
            <input ref={repeatPasswordInputRef} id={repeatPasswordInputId} type="password"
              data-sf-role="required"
              {...inputValidationAttrs('NewPassword')}/>
          </div>

          <input type="hidden" name="SecurityToken" value={props.securityToken} />
          <input type="hidden" name="MembershipProviderName" value={props.membershipProviderName  || ''} />
          <input className="btn btn-primary w-100" type="submit" value={labels.saveButtonLabel} />
        </form>
        <input type="hidden" name="ErrorMessage" value={labels.errorMessage} />
        <input type="hidden" name="AllFieldsAreRequiredErrorMessage" value={labels.allFieldsAreRequiredErrorMessage} />
        <input type="hidden" name="PasswordsMismatchErrorMessage" value={labels.passwordsMismatchErrorMessage} />
      </div>
      <div data-sf-role="success-message-container"
        className={successContainerClass}
        style={successContainerStyle}>
        <h2>{labels.successMessage}</h2>
        {props.loginPageUrl &&
        <a href={props.loginPageUrl} className="text-decoration-none">{labels.backLinkLabel}</a>
        }
      </div>
    </>);
};
