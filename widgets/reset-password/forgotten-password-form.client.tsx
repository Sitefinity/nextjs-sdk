'use client';

import React from 'react';
import { VisibilityStyle } from '../styling/visibility-style';
import { SF_WEBSERVICE_API_KEY_HEADER, invalidDataAttr, invalidateElement, isValidEmail, serializeForm } from '../common/utils';
import { classNames } from '../../editor/utils/classNames';
import { ResetPasswordViewProps } from './interfaces/reset-password.view-props';
import { ResetPasswordEntity } from './reset-password.entity';
import { getUniqueId } from '../../editor/utils/getUniqueId';

export function ForgottenPasswordFormClient(props: ResetPasswordViewProps<ResetPasswordEntity>) {
    const emailInputId = getUniqueId('sf-email-', props.widgetContext.model.Id);
    const formRef = React.useRef<HTMLFormElement>(null);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const labels = props.labels;
    const visibilityClassHidden = props.visibilityClasses[VisibilityStyle.Hidden];
    const [invalidInputs, setInvalidInputs] = React.useState<{ [key: string]: boolean | undefined; }>({});
    const [showFormContainer, setFormContainer] = React.useState<boolean>(true);
    const [showSuccessContainer, setSuccessContainer] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [sentEmailLabelMessage, setSentEmailLabelMessage] = React.useState<string>('');
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm(formRef.current!)) {
            return;
        }

        let model = { model: serializeForm(formRef.current!) };
        let submitUrl = (formRef.current!.attributes as any)['action'].value;

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (props.webserviceApiKey) {
            headers[SF_WEBSERVICE_API_KEY_HEADER] = props.webserviceApiKey;
        }

        window.fetch(submitUrl, { method: 'POST', body: JSON.stringify(model), headers })
            .then(() => {
                setSentEmailLabelMessage(emailInputRef.current!.value);
                setFormContainer(false);
                setSuccessContainer(true);
            });
    };

    const validateForm = function (form: HTMLFormElement) {
        let isValid = true;
        setInvalidInputs({});
        setErrorMessage('');
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
            setErrorMessage(labels.fieldIsRequiredMessage);

            return false;
        }

        if (!isValidEmail(emailInputRef.current!.value)) {
            invalidateElement(emptyInputs, emailInputRef.current!);
            setInvalidInputs(emptyInputs);
            setErrorMessage(labels.invalidEmailFormatMessage);
            return false;
        }

        return true;
    };

    const inputValidationAttrs = (name: string) => {
        return {
            className: classNames('form-control', {
                [props.invalidClass]: invalidInputs[name]
            }
            ),
            [invalidDataAttr]: invalidInputs[name],
            name: name
        };
    };

    const errorMessageClass = classNames('alert alert-danger my-3', {
        [visibilityClassHidden]: !errorMessage || errorMessage === ''
    });
    const errorMessageStyles = {
        display: !visibilityClassHidden ? errorMessage ? '' : 'none' : ''
    };

    const successContainerClass = classNames('mt-3', {
        [visibilityClassHidden]: !showSuccessContainer
    });
    const successContainerStyle = {
        display: !visibilityClassHidden ? showSuccessContainer ? '' : 'none' : ''
    };

    if (props.widgetContext.requestContext.isLive && !props.resetPasswordUrl?.toUpperCase().startsWith('HTTP')) {
        props = { ...props, resetPasswordUrl: typeof window !== 'undefined' ? window.location.protocol + '//' + props.resetPasswordUrl : '' };
    }

    return (<>
      <div data-sf-role="error-message-container"
        className={errorMessageClass}
        style={errorMessageStyles}
        role="alert" aria-live="assertive">
        {errorMessage}
      </div>
      <div data-sf-role="form-container"
        className={classNames({
                [visibilityClassHidden]: !showFormContainer
            })}
        style={{
                display: !visibilityClassHidden ? showFormContainer ? '' : 'none' : ''
            }}
        >
        <p>{labels.forgottenPasswordLabel}</p>
        <form ref={formRef} onSubmit={handleSubmit} action={props.sendResetPasswordEmailHandlerPath} role="form" noValidate={true}>
          <div className="mb-3">
            <label className="form-label" htmlFor={emailInputId}>{labels.emailLabel}</label>
            <input ref={emailInputRef} id={emailInputId} type="email"
              data-sf-role="required"
              {...inputValidationAttrs('Email')} />
          </div>
          <input className="btn btn-primary w-100" type="submit" value={labels.sendButtonLabel} />
          <input type="hidden" name="ResetPasswordUrl" value={props.resetPasswordUrl} />
          <input type="hidden" name="MembershipProviderName" value={props.membershipProviderName || ''} />
          <input type="hidden" name="RegistrationPageUrl" value={props.registrationPageUrl} />
        </form>

        <input type="hidden" name="InvalidEmailFormatMessage" value={labels.invalidEmailFormatMessage} />
        <input type="hidden" name="FieldIsRequiredMessage" value={labels.fieldIsRequiredMessage} />
      </div>
      <div data-sf-role="success-message-container"
        className={successContainerClass}
        style={successContainerStyle}>
        <p>{`${labels.forgottenPasswordSubmitMessage} `}<strong data-sf-role="sent-email-label">{sentEmailLabelMessage}</strong></p>
        <p>{labels.forgottenPasswordLinkMessage}</p>
      </div>
    </>);
};
