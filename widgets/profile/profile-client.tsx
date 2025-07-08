'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { ProfileViewProps } from './interfaces/profile.view-props';
import { ProfileEntity } from './profile.entity';
import { VisibilityStyle } from '../styling/visibility-style';
import { classNames } from '../../editor/utils/classNames';
import { invalidateElement, isValidEmail } from '../common/utils';
import { SecurityService } from '../../services/security-service';
import { ProfileViewMode } from './interfaces/profile-view-mode';
import { ActivationMethod } from '../../rest-sdk/dto/registration-settings';
import { ProfileForm } from './profile-form';
import { useRouter } from 'next/navigation';
import { ProfilePostUpdateAction } from './interfaces/profile-post-update-action';

export interface ProfileClientProps {
    viewProps: ProfileViewProps<ProfileEntity>;
    successMessage: boolean;
    setSuccessMessage: Dispatch<SetStateAction<boolean>>;
    formData: { [key: string]: any };
    setFormData: Dispatch<SetStateAction<{ [key: string]: any }>>;
    initialEmail: string;
    setInitialEmail: Dispatch<SetStateAction<string>>;
}

export function ProfileClient(props: ProfileClientProps) {
    const { 
        viewProps, 
        successMessage, 
        setSuccessMessage, 
        formData, 
        setFormData,
        initialEmail,
        setInitialEmail
    } = props;

    const context = viewProps.widgetContext.requestContext;
    const labels = viewProps.labels;
    const visibilityClassHidden = viewProps.visibilityClasses![VisibilityStyle.Hidden];
    const allowedAvatarFormats = viewProps.allowedAvatarFormats?.join(', ');

    const router = useRouter();

    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[] | null>(null);
    const [showProfileContainer, setShowProfileContainer] = useState<boolean>(true);
    const [showFormContainer, setShowFormContainer] = useState<boolean>(true);
    const [invalidInputs, setInvalidInputs] = useState<{ [key: string]: boolean | undefined; }>({});
    const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
    const [isEmailChange, setIsEmailChange] = useState<boolean>(false);
    const [showConfirmEmailChangeContainer, setShowConfirmEmailChangeContainer] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>();

    const confirmContainerClass = classNames({
        [visibilityClassHidden]: !showConfirmEmailChangeContainer
    });

    const confirmContainerStyle = {
        display: !visibilityClassHidden ? showConfirmEmailChangeContainer ? '' : 'none' : ''
    };

    const profileContainerClass = classNames({
        [visibilityClassHidden]: !showProfileContainer
    });

    const profileContainerStyle = {
        display: !visibilityClassHidden ? showProfileContainer ? '' : 'none' : ''
    };

    const formContainerClass = classNames({
        [visibilityClassHidden]: !showFormContainer
    });

    const formContainerStyle = {
        display: !visibilityClassHidden ? showFormContainer ? '' : 'none' : ''
    };

    const errorMessageClass = classNames('alert alert-danger my-3', {
        [visibilityClassHidden]: !errorMessages
    });

    const errorMessageStyles = {
        display: !visibilityClassHidden ? errorMessages ? '' : 'none' : ''
    };

    const hideMessages = () => {
        setErrorMessages(null);
        setSuccessMessage(false);
    };

    const showSuccessMessage = () => {
        setErrorMessages(null);
        setShowFormContainer(true);
        setSuccessMessage(true);
    };

    const validateFile = (file: File) => {
        const fileSize = file.size;
        const maxSize = 25 * 1024 * 1024;
        const fileName : string = file.name;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

        if (fileSize > maxSize || !allowedAvatarFormats?.split(',').map(x => x.trim()).includes(fileExtension)) {
            setErrorMessages([labels.invalidPhotoErrorMessage.replace('{0}', maxSize.toString()).replace('{1}', allowedAvatarFormats!)]);
            return false;
        }

        return true;
    };

    const submitForm = (form: HTMLFormElement) => {
        hideMessages();

        if (!validateForm(form)) {
            return;
        }

        if (!showPasswordPrompt) {
            setFormData((prevData) => ({ ...prevData, Password: '' }));
        }

        if (formData.Email !== initialEmail && !showPasswordPrompt) {
            hideMessages();
            setShowPasswordPrompt(true);
            setIsEmailChange(true);
            return;
        }

        SecurityService.setAntiForgeryTokens().then(() => {
            if (validateForm(form)) {
                submitFormHandler(form, '', postSubmitAction, onSubmitError);
            }
        }, () => {
            setErrorMessages(['AntiForgery token retrieval failed']);
        });
    };

    const validateForm = (form: HTMLFormElement) => {
        let isValid = true;
        setInvalidInputs({});
        setErrorMessages(null);
        const emptyInputs = {};

        Array.from(form.elements).forEach((element) => {
            const input = (element as HTMLInputElement);

            if (!input.value && input.required && !viewProps.readOnlyFields?.includes(input.name)) {
                invalidateElement(emptyInputs, input);
                setInvalidInputs(emptyInputs);
                isValid = false;
            }
        });

        if (!isValid) {
            setErrorMessages([labels.validationRequiredMessage]);
            return isValid;
        }

        const emailInput = form.querySelector('[name=\'Email\']') as HTMLInputElement;
        if (!isValidEmail(emailInput.value)) {
            invalidateElement(emptyInputs, emailInput);
            setInvalidInputs(emptyInputs);
            setErrorMessages([labels.invalidEmailErrorMessage]);
            return false;
        }

        if (fileUpload != null) {
            if (!validateFile(fileUpload)) {
                return false;
            }
        }

        return isValid;
    };

    const serializeForm = (form: HTMLFormElement) => {
        const result = new FormData();
        const formData: any = new FormData(form);

        if (viewProps.id) {
            result.append('Id', viewProps.id);
        }

        for (const [key, value] of formData.entries()) {
            if (key === 'Avatar') {
                if (fileUpload !== null) {
                    result.append('image', fileUpload);
                }
                continue;
            }
            
            result.append(key, value);
        }

        return result;
    };

    const submitFormHandler = (
        form: HTMLFormElement,
        url: RequestInfo | URL,
        onSuccess: (response: Response)=> void,
        onError?: (err: string, fieldsErrors: { [key: string]: string; }, form: HTMLFormElement)=> void
    ) => {
        url = url || (form.attributes as any)['action'].value;

        const requestBody = serializeForm(form);

        window.fetch(url, {
            method: 'POST',
            body: requestBody
        }).then((response) => {
            let status = response.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                if (onSuccess) {
                    onSuccess(response);
                }
            } else {
                response.json().then((res) => {
                    const message = res.error.message;
                    const fieldsErrors = res.error.fieldsErrors;

                    if (onError) {
                        onError(message, fieldsErrors, form);
                    }
                });
            }
        }).finally(() => {
            if (showPasswordPrompt) {
                setFormData((prevData) => ({ ...prevData, Password: '' }));
                setShowPasswordPrompt(false);
            }
        });
    };

    const postSubmitAction = (response: Response) => {
        if (isEmailChange && viewProps.activationMethod === ActivationMethod.AfterConfirmation) {
            setShowProfileContainer(false);
            setShowConfirmEmailChangeContainer(true);
        } else {
            let action;
            let redirectUrl = '';

            switch (viewProps.viewMode) {
                case ProfileViewMode.Edit:{
                    action = viewProps.editModeAction;
                    if (viewProps.editModeRedirectUrl) { 
                        redirectUrl = viewProps.editModeRedirectUrl;
                    }
                    
                    break;
                }
                case ProfileViewMode.ReadEdit:{
                    action = viewProps.readEditModeAction;
                    if (viewProps.readEditModeRedirectUrl) {
                        redirectUrl = viewProps.readEditModeRedirectUrl;
                    }
                    
                    break;
                }
                default:
                    break;
            }
            
            switch (action) {
                case ProfilePostUpdateAction.ViewMessage:{
                    response.json().then((res) => {
                        setFormData((prevData) => ({ ...prevData, Avatar: res.value.AvatarUrl }));
                        setInitialEmail(res.value.Email);
                    });

                    showSuccessMessage();
                    break;
                }
                case ProfilePostUpdateAction.SwitchToReadMode:{
                    response.json().then((res) => {
                        setFormData((prevData) => ({ ...prevData, Avatar: res.value.AvatarUrl }));
                        setInitialEmail(res.value.Email);
                    });

                    setShowEdit(false);
                    break;
                }
                case ProfilePostUpdateAction.RedirectToPage:{
                    router.push(redirectUrl);
                    break;
                }
                default:
                    break;
            }
        }
    };

    const onSubmitError = (errorMessage: string, responseFieldsErrors: { [key: string]: string; }, form: HTMLFormElement) => {
        setShowConfirmEmailChangeContainer(false);
        setIsEmailChange(false);

        const invalidInputs = {};
        let fieldErrors = [];
        
        if (errorMessage) {
            fieldErrors.push(errorMessage);
        }

        if (responseFieldsErrors) {
            Object.keys(responseFieldsErrors).forEach(key => {
                const inputElement = form.querySelector(`[name='${key}']`) as HTMLInputElement;

                if (inputElement) {
                    invalidateElement(invalidInputs, inputElement);

                    if (inputElement.id) {
                        const fieldName = form.querySelector(`[for='${inputElement.id}']`)?.innerHTML;
                        fieldErrors.push(responseFieldsErrors[key].replace('{0}', fieldName!));
                    } else {
                        fieldErrors.push(responseFieldsErrors[key]);
                    }
                }
            });
        }

        setInvalidInputs(invalidInputs);
        setErrorMessages(fieldErrors);
    };

    return (
      <>
        <div data-sf-role="profile-container"
          className={profileContainerClass}
          style={profileContainerStyle}
        >
          {viewProps.viewMode === ProfileViewMode.Read || viewProps.viewMode === ProfileViewMode.ReadEdit && !showEdit ?
            <div data-sf-role="read-container" className="d-flex">
              <div className="flex-shrink-0">
                {
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img data-sf-role="sf-user-profile-avatar" src={formData.Avatar || ''} alt={formData.Email || ''} width={100}/>
                }
              </div>
              <div className="flex-grow-1 ms-2">
                <h2 className="mb-0">{formData.FirstName} {formData.LastName}</h2>
                <p className="text-muted mb-3">{formData.Email}</p>
                {viewProps.viewMode === ProfileViewMode.ReadEdit &&
                  <a 
                    data-sf-role="editProfileLink"
                    href="#" 
                    onClick={() => setShowEdit(true)} 
                    style={{textDecoration: 'none'}}>
                    {labels.editProfileLink}
                  </a>
                }
              </div>
            </div>
            :
            <div data-sf-role="form-container"
              className={formContainerClass}
              style={formContainerStyle}>
              <div data-sf-role="error-message-container"
                className={errorMessageClass}
                style={errorMessageStyles}
                role="alert" aria-live="assertive">
                {errorMessages?.map((error, index) => (
                  <div key={index}>
                    {error}
                    <br/>
                  </div>
                ))}
              </div>
              {successMessage &&
              <div data-sf-role="success-message-container"
                className="alert alert-success my-3"
                role="alert" aria-live="assertive">
                {labels.successNotification}
              </div>
              }
              <div>
                <h2 className="mb-3">
                  {labels.header}
                </h2>
              </div>
              <ProfileForm
                formData={formData}
                setFormData={setFormData}
                submitForm={submitForm}
                setFileUpload={setFileUpload}
                viewProps={viewProps}
                showPasswordPrompt={showPasswordPrompt}
                invalidInputs={invalidInputs}
                allowedAvatarFormats={allowedAvatarFormats}
                isContextLive={context?.isLive}
              />
            </div>
          }
        </div>
        <>
          {viewProps.viewMode !== ProfileViewMode.Read &&
          <div data-sf-role="confirm-email-change-container"
            className={confirmContainerClass}
            style={confirmContainerStyle}>
            <div className="mb-3" data-sf-role="confirm-email-change-title">
              <h2>{labels.confirmEmailChangeTitleLabel}</h2>
            </div>
            <div className="mb-3" data-sf-role="confirm-email-change-message">
              {labels.confirmEmailChangeDescriptionLabel}
            </div>
          </div>
          }
        </>
      </>
    );
}
