'use client';

import React from 'react';
import { RegistrationEntity } from './registration.entity';
import { RegistrationViewProps } from './interfaces/registration.view-props';
import { serializeForm } from '../common/utils';

export interface RegistrationFormProps {
    action: string;
    viewProps: RegistrationViewProps<RegistrationEntity>;
}

export function ActivationClient(props: RegistrationFormProps) {
    const { viewProps } = props;
    const labels = viewProps.labels;
    const formRef = React.useRef<HTMLFormElement>(null);

    const [sendAgain, setSendAgain] = React.useState<boolean>(false);
    const [confirmationContainerHeader, setConfirmationContainerHeader] = React.useState<string>(
        labels.activationExpiredHeader
    );
    const [confirmationContainerLabel, setConfirmationContainerLabel] = React.useState<string>(
        labels.activationExpiredLabel.replace('{0}', viewProps.email ? viewProps.email : '')
    );
    const [confirmationContainerBtnText, setConfirmationContainerBtnText] = React.useState<string>(
        labels.activationExpiredBtnText
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = formRef.current!;
        const url = (form.attributes as any)['action'].value;

        let model = { model: serializeForm(form) };

        window
            .fetch(url, {
                method: 'POST',
                body: JSON.stringify(model),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(() => {
                if (sendAgain) {
                    setConfirmationContainerLabel(
                        labels.sendAgainLabel.replace('{0}', viewProps.email ? viewProps.email : '')
                    );
                } else {
                    setConfirmationContainerHeader(labels.activationLinkHeader);
                    setConfirmationContainerLabel(
                        `${labels.activationLinkLabel} ${viewProps.email ? viewProps.email : ''}`
                    );
                    setConfirmationContainerBtnText(labels.sendAgainLink);

                    setSendAgain(true);
                }
            });
    };

    return (
      <>
        <div data-sf-role="confirm-registration-message-container">
          <form
            ref={formRef}
            role="form"
            noValidate={true}
            method="post"
            action={props.action}
            onSubmit={handleSubmit}
                >
            <h3>{confirmationContainerHeader}</h3>
            <p data-sf-role="activation-link-message-container">{confirmationContainerLabel}</p>
            <input type="hidden" name="Email" value={viewProps.email} />
            <input type="hidden" name="ActivationPageUrl" value={viewProps.activationPageUrl} />
            <input
              type="submit"
              data-sf-role="sendAgainLink"
              className="btn btn-primary"
              value={confirmationContainerBtnText}
                    />
          </form>
        </div>
      </>
    );
}
