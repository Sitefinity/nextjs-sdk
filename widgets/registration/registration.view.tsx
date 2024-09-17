'use client';

import { useSearchParams } from 'next/navigation';
import { RegistrationFormClient } from './registration-form.client';
import { RegistrationEntity } from './registration.entity';
import { getQueryParams } from '../common/query-params';
import { useEffect, useMemo, useState } from 'react';
import { RestClient } from '../../rest-sdk/rest-client';
import { RegistrationViewProps } from './interfaces/registration.view-props';

const EncryptedParam = 'qs';
export function RegistrationDefaultView(props: RegistrationViewProps<RegistrationEntity>) {
    const entity = props.widgetContext.model.Properties;
    const context = props.widgetContext.requestContext;
    const searchParams = useSearchParams();
    const queryParams = useMemo(() => {
      return getQueryParams(searchParams);
    }, [searchParams]);

    const labels = props.labels;
    const showSuccessMessage = useMemo(() => {
      return getQueryParams(searchParams).showSuccessMessage?.toLowerCase() === 'true';
    }, [searchParams]);

    const isAccountActivationRequest = useMemo(() => {
      if (context?.isLive && queryParams && queryParams[EncryptedParam]) {
          return true;
      }

      return false;
    }, [context?.isLive, queryParams]);

    const [activationMessage, setActivationMessage] = useState<string>(entity.ActivationMessage);

    useEffect(() => {

      if (isAccountActivationRequest) {
        RestClient.activateAccount(queryParams[EncryptedParam]).catch(() => {
          setActivationMessage(entity.ActivationFailMessage);
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAccountActivationRequest]);


    return (
      <>
        <div
          {...props.attributes}
          >
          {isAccountActivationRequest && <h2 className="mb-3">
              {activationMessage}
          </h2>
          }
          {!isAccountActivationRequest && (<>
            {showSuccessMessage && <h3>{labels.successHeader}</h3>}
            {showSuccessMessage && <p>{labels.successLabel}</p>}
            {
              !showSuccessMessage &&
              <>

                <RegistrationFormClient
                  action={props.registrationHandlerPath}
                  viewProps={props}
                   />
              </>
            }
            </>)
          }
        </div>
      </>
    );
}
