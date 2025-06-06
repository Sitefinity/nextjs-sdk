'use client';

import { useSearchParams } from 'next/navigation';
import { RegistrationFormClient } from './registration-form.client';
import { RegistrationEntity } from './registration.entity';
import { getQueryParams } from '../common/query-params';
import { useEffect, useMemo, useState } from 'react';
import { RestClient } from '../../rest-sdk/rest-client';
import { RegistrationViewProps } from './interfaces/registration.view-props';
import { ErrorCodeException } from '../../rest-sdk/errors/error-code.exception';
import { ActivationClient } from './activation.client';

const EncryptedParam = 'qs';
export function RegistrationDefaultView(props: RegistrationViewProps<RegistrationEntity>) {
  const entity = props.widgetContext.model.Properties;
  const context = props.widgetContext.requestContext;
  const searchParams = useSearchParams();
  const queryParams = useMemo(() => {
    return getQueryParams(searchParams);
  }, [searchParams]);

  const labels = props.labels;
  const [propsClone, setPropsClone] = useState<RegistrationViewProps<RegistrationEntity>>(JSON.parse(JSON.stringify(props)));

  const showSuccessMessage = useMemo(() => {
    return getQueryParams(searchParams).showSuccessMessage?.toLowerCase() === 'true';
  }, [searchParams]);

  const isAccountActivationRequest = useMemo(() => {
    if (context?.isLive && queryParams && queryParams[EncryptedParam]) {
      return true;
    }

    return false;
  }, [context?.isLive, queryParams]);

  const [activationTitle, setActivationTitle] = useState<string>();
  const [activationLabel, setActivationLabel] = useState<string>();
  const [isActivationError, setIsActivationError] = useState<boolean>(false);
  const [isActivationExpired, setIsActivationExpired] = useState<boolean>(false);
  useEffect(() => {
    if (isAccountActivationRequest) {
      RestClient.activateAccount(queryParams[EncryptedParam]).then(() => {
        setActivationTitle(entity.ActivationMessage);
      }).catch((error) => {
        if (error instanceof ErrorCodeException && error.code === 'Gone') {
          setIsActivationExpired(true);
          setPropsClone((currentProps) => ({
            ...currentProps,
            email: error.message
          }));
        } else {
          setIsActivationError(true);
          setActivationTitle(entity.ActivationFailTitle);
          setActivationLabel(entity.ActivationFailLabel);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountActivationRequest]);

  return (
    <>
      <div
        {...propsClone.attributes}
      >
        {isActivationExpired &&
          <>
            <ActivationClient
              action={propsClone.resendConfirmationEmailHandlerPath}
              viewProps={propsClone}
            />
          </>}

        {(isAccountActivationRequest && !isActivationExpired) && <h2 className="mb-3">
          {activationTitle}
        </h2>
        }
        {isActivationError && <p>{activationLabel}</p>
        }
        {!isAccountActivationRequest && (<>
          {showSuccessMessage && <h3>{labels.successHeader}</h3>}
          {showSuccessMessage && <p>{labels.successLabel}</p>}
          {
            !showSuccessMessage &&
            <>

              <RegistrationFormClient
                action={propsClone.registrationHandlerPath}
                viewProps={propsClone}
              />
            </>
          }
        </>)
        }
      </div>
    </>
  );
}
