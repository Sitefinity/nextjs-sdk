'use client';

import { Dispatch, SetStateAction, useRef } from 'react';
import { getUniqueId } from '../../editor/utils/getUniqueId';
import { ProfileViewProps } from './interfaces/profile.view-props';
import { ProfileEntity } from './profile.entity';
import { classNames } from '../../editor/utils/classNames';
import { VisibilityStyle } from '../styling/visibility-style';
import { invalidDataAttr } from '../common/utils';

export interface ProfileFormProps {
    formData: { [key: string]: any };
    setFormData: Dispatch<SetStateAction<{ [key: string]: any }>>;
    submitForm: (form: HTMLFormElement) => void;
    setFileUpload: Dispatch<SetStateAction<File | null>>;
    viewProps: ProfileViewProps<ProfileEntity>;
    showPasswordPrompt: boolean;
    invalidInputs: { [key: string]: boolean | undefined; };
    allowedAvatarFormats: string | undefined;
    isContextLive: boolean;
}

export function ProfileForm(props: ProfileFormProps) {
    const { 
        formData, 
        setFormData,
        submitForm,
        setFileUpload,
        viewProps,
        showPasswordPrompt, 
        invalidInputs,
        allowedAvatarFormats,
        isContextLive
    } = props;

    const labels = viewProps.labels;

    const defaultAvatarUrl = '/SFRes/images/Telerik.Sitefinity.Resources/Images.DefaultPhoto.png';

    const firstNameInputId = getUniqueId('sf-first-name-', viewProps.widgetContext.model.Id);
    const lastNameInputId = getUniqueId('sf-last-name-', viewProps.widgetContext.model.Id);
    const emailInputId = getUniqueId('sf-email-', viewProps.widgetContext.model.Id);
    const nicknameInputId = getUniqueId('sf-nickname-', viewProps.widgetContext.model.Id);
    const aboutInputId = getUniqueId('sf-about-', viewProps.widgetContext.model.Id);
    const passwordInputId = getUniqueId('sf-password-', viewProps.widgetContext.model.Id);
    const fileUploadInputId = getUniqueId('sf-file-upload-', viewProps.widgetContext.model.Id);

    const formRef = useRef<HTMLFormElement>(null);

    const visibilityClassHidden = viewProps.visibilityClasses![VisibilityStyle.Hidden];

    const editProfileContainerClass = classNames({
        [visibilityClassHidden]: showPasswordPrompt
    });

    const editProfileContainerStyle = {
        display: !visibilityClassHidden ? !showPasswordPrompt ? '' : 'none' : ''
    };

    const passwordContainerClass = classNames({
        [visibilityClassHidden]: !showPasswordPrompt
    });
    
    const passwordContainerStyle = {
        display: !visibilityClassHidden ? showPasswordPrompt ? '' : 'none' : ''
    };

    const inputValidationAttrs = (name: string) => {
        return {
            className: classNames('form-control', {
                [viewProps.invalidClass!]: invalidInputs[name]
            }
            ),
            [invalidDataAttr]: invalidInputs[name],
            name: name
        };
    };

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileUpload = (event : React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData((prevData) => ({ ...prevData, Avatar: e.target?.result }));
            };
            reader.readAsDataURL(file);

            setFileUpload(file);
        }
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitForm(formRef.current!);
    };

    return (
      <>
        <form ref={formRef}
          role="form"
          noValidate={true}
          method="post"
          action={viewProps.updateProfileHandlerPath}
          onSubmit={handleFormSubmit}
        >
          <div data-sf-role="edit-profile-container"
            className={editProfileContainerClass}
            style={editProfileContainerStyle}>
            <div className="d-flex">
              <div className="mb-3">
                {
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img data-sf-role="sf-user-profile-avatar" src={formData.Avatar || defaultAvatarUrl} alt={formData.Email || ''} width={100} />
                }
              </div>
              <div className="mx-3">
                <a href="#" className="link-primary">
                  <label htmlFor={fileUploadInputId}>{labels.changePhotoLabel}</label>
                </a>
                <input
                  onChange={handleFileUpload}
                  type="file"
                  id={fileUploadInputId}
                  data-sf-role="edit-profile-upload-picture-input"
                  name="Avatar"
                  style={{display: 'none'}}
                  accept={allowedAvatarFormats}/>
              </div>
            </div>
            <ProfileFormInput
              id={firstNameInputId}
              type="text"
              value={formData.FirstName || ''} 
              label={labels.firstNameLabel}
              onChange={handleInputChange}
              required={true}
              disabled={viewProps.readOnlyFields?.includes('FirstName')}
              attributes={{...inputValidationAttrs('FirstName')}}
            />
            <ProfileFormInput
              id={lastNameInputId}
              type="text"
              value={formData.LastName || ''} 
              label={labels.lastNameLabel}
              onChange={handleInputChange}
              required={true}
              disabled={viewProps.readOnlyFields?.includes('LastName')}
              attributes={{...inputValidationAttrs('LastName')}}
            />
            <ProfileFormInput
              id={emailInputId}
              type="text"
              value={formData.Email || ''} 
              label={labels.emailLabel}
              onChange={handleInputChange}
              required={true}
              disabled={viewProps.readOnlyFields?.includes('Email')}
              attributes={{...inputValidationAttrs('Email')}}
            />
            <ProfileFormInput
              id={nicknameInputId}
              type="text"
              value={formData.Nickname || ''} 
              label={labels.nicknameLabel}
              onChange={handleInputChange}
              required={false}
              disabled={viewProps.readOnlyFields?.includes('Email')}
              attributes={{...inputValidationAttrs('Nickname')}}
            />
            <div className="mb-3">
              <label htmlFor={aboutInputId} className="form-label">{labels.aboutLabel}</label>
              <textarea
                id={aboutInputId}
                value={formData.About || ''}
                onChange={handleInputChange}
                disabled={viewProps.readOnlyFields?.includes('About')}
                {...inputValidationAttrs('About')} />
            </div>
          </div>
          <div 
            data-sf-role="password-container"
            className={passwordContainerClass}
            style={passwordContainerStyle}>
            <div className="mb-3">
              {labels.changeEmailLabel}
            </div>
            <ProfileFormInput
              id={passwordInputId}
              type="password"
              value={formData.Password || ''} 
              label={labels.passwordLabel}
              onChange={handleInputChange}
              required={false}
              disabled={false}
              attributes={{...inputValidationAttrs('Password')}}
            />
          </div>
          <input className="btn btn-primary w-100" type="submit" value={labels.saveButtonLabel} disabled={!isContextLive} />
          <input type="hidden" value="" name="sf_antiforgery" />
        </form>
      </>
    );
};

export interface ProfileFormInputProps {
    id: string;
    label: string;
    type: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean | undefined;
    required: boolean;
    attributes: { [key:string]: any };
}

export function ProfileFormInput(props : ProfileFormInputProps) {
    return (
      <div className="mb-3">
        <label htmlFor={props.id} className="form-label">{props.label}</label>
        <input 
          id={props.id}
          type={props.type}
          value={props.value || ''} 
          onChange={props.onChange}
          required={props.required}
          disabled={props.disabled}
          {...props.attributes}
        />
      </div>
    );
}
