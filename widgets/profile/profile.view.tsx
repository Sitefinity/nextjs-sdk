'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProfileEntity } from './profile.entity';
import { ProfileViewProps } from './interfaces/profile.view-props';
import { useSearchParams } from 'next/navigation';
import { ProfileClient } from './profile-client';
import { RestClient } from '../../rest-sdk/rest-client';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { SecurityService } from '../../services/security-service';

const EncryptedParam = 'qs';
export function ProfileDefaultView(props: ProfileViewProps<ProfileEntity>) {
    const context = props.widgetContext.requestContext;
    const labels = props.labels;

    const searchParams = useSearchParams();

    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(props.isUserAuthenticated ?? false);
    const [initialEmail, setInitialEmail] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');
    const [isConfirmEmailRequest, setIsConfirmEmailRequest] = useState<boolean>(false);
    const [sendAgainActivationLink, setSendAgainActivationLink] = useState<boolean>(false);
    const [confirmEmailExpiredError, setConfirmEmailExpiredError] = useState<boolean>(false);
    const [emailChangeError, setEmailChangeError] = useState<boolean>(false);
    const [errorObj, setErrorObj] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<boolean>(false);
    const [propsClone, setPropsClone] = useState<ProfileViewProps<ProfileEntity>>(JSON.parse(JSON.stringify(props)));
    
    const [formData, setFormData] = useState<{ [key: string]: any }>({
        FirstName: props?.firstName,
        LastName: props?.lastName,
        Email: props?.email,
        Password: '',
        Nickname: props?.nickname,
        About: props?.about,
        Avatar: props?.avatarUrl,
        ...props?.customFields
    });

    const confirmEmailChangeParam = useMemo(() => {
        if (searchParams.get(EncryptedParam)) {
            setIsConfirmEmailRequest(true);
            return searchParams.get(EncryptedParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (context?.isLive && confirmEmailChangeParam) {
            handleEmailChange(confirmEmailChangeParam);
        }
    }, [context?.isLive, confirmEmailChangeParam]);

    const getUserData = async () => {
        const user = await RestClient.getCurrentUser().then((user) => {
            const hasUser = (user && user.IsAuthenticated);
            if (hasUser) {
                return user;
            }
        });

        if (!user?.IsAuthenticated) {
            return;
        }

        setPropsClone((currentProps) => ({
            ...currentProps,
            id: user?.Id!,
            email: user?.Email,
            firstName: user?.FirstName!,
            lastName: user?.LastName!,
            nickname: user?.Nickname!,
            about: user?.About!,
            avatarUrl: user?.Avatar!,
            allowedAvatarFormats: user?.AllowedAvatarFormats,
            customFields: user?.CustomFields,
            readOnlyFields: user?.ReadOnlyFields
        }));

        setFormData({
            FirstName: user?.FirstName!,
            LastName: user?.LastName!,
            Email: user?.Email,
            Password: '',
            Nickname: user?.Nickname!,
            About: user?.About!,
            Avatar: user?.Avatar!,
            ...user?.CustomFields
        });

        setInitialEmail(user?.Email);
        setIsUserAuthenticated(true);
    };

    useEffect(() => {
        if (!context.isEdit) {
            getUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEmailChange = (confirmEmailChangeParam: string) => {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/users/changeEmail${RestClient.buildQueryParams({ qs: encodeURIComponent(confirmEmailChangeParam) })}`;

        window.fetch(wholeUrl, {
            method: 'GET'
        }).then((response) => {
            const status = response.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                setIsConfirmEmailRequest(false);
                setSuccessMessage(true);
                response.json().then((res) => {
                    setFormData((prevState) => ({ ...prevState, Email: res.value.Email }));
                    setInitialEmail(res.value.Email);
                });
            } else if (status === 400) {
                setEmailChangeError(true);
            } else {
                response.json().then((res) => {
                    const error = res.error;
                    if (error && error.code === 'Gone') {
                        setNewEmail(JSON.parse(error.message).Email);
                        setErrorObj(JSON.parse(error.message));
                        setConfirmEmailExpiredError(true);
                    }
                });
            }
        });
    };

    const handleSendAgain = () => {
        const sendAgainActivationLinkUrl = props.sendAgainActivationLinkUrl;
        const requestBody = new FormData();

        for (let key in errorObj) {
            if (Object.hasOwn(errorObj, key)) {
                requestBody.append(key, errorObj[key]);
            }
        }

        SecurityService.setAntiForgeryTokens().then(() => {
            window.fetch(sendAgainActivationLinkUrl, {
                method: 'POST',
                body: requestBody
            });
        });

        setSendAgainActivationLink(true);
    };

    return (
      <>
        <div {...propsClone.attributes}>
          {isUserAuthenticated &&
          <>
            {!isConfirmEmailRequest ?
              <ProfileClient
                viewProps={propsClone}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                formData={formData}
                setFormData={setFormData}
                initialEmail={initialEmail}
                setInitialEmail={setInitialEmail}
              />
              :
              <>
                {confirmEmailExpiredError ?
                  <div data-sf-role="confirm-email-change-container">
                    <div className="mb-3" data-sf-role="confirm-email-change-title">
                      <h2>{sendAgainActivationLink ? labels.sendConfirmationLinkSuccessTitle : labels.confirmEmailChangeTitleExpiredLabel}</h2>
                    </div>
                    <div className="mb-3" data-sf-role="confirm-email-change-message">
                      {sendAgainActivationLink
                      ? labels.sendConfirmationLinkSuccessMessage.replace('{0}', newEmail)
                      : labels.confirmEmailChangeDescriptionExpiredLabel.replace('{0}', newEmail)
                      }
                    </div>
                    <input
                      className="btn btn-primary"
                      type="submit"
                      onClick={handleSendAgain}
                      value={sendAgainActivationLink ? labels.sendAgainActivationLink : labels.sendActivationLink} />
                  </div>
                  : emailChangeError &&
                  <div data-sf-role="confirm-email-change-error-container">
                    <div className="mb-3">
                      <h2>{labels.confirmEmailChangeTitleErrorLabel}</h2>
                    </div>
                    <div className="mb-3">
                      {labels.confirmEmailChangeDescriptionErrorLabel}
                    </div>
                  </div>
                }
              </>
            }
          </>
          }
        </div>
      </>
    );
}
