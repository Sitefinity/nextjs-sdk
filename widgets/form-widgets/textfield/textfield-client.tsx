'use client';

import React, { useContext, useState } from 'react';
import { VisibilityStyle } from '../../styling/visibility-style';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';
import { TextFieldViewProps } from './text-field.view-props';
import { TextFieldEntity } from './text-field.entity';
import { getUniqueId } from '../../../editor/utils/getUniqueId';

export function TextFieldClient(props: TextFieldViewProps<TextFieldEntity>) {
    const textBoxUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const textBoxErrorMessageId = getUniqueId('TextboxErrorMessage', props.widgetContext.model.Id);
    const textBoxInfoMessageId = getUniqueId('TextboxInfo', props.widgetContext.model.Id);
    const ariaDescribedByAttribute = props.hasDescription ? `${textBoxUniqueId} ${textBoxErrorMessageId}` : textBoxErrorMessageId;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState(props.predefinedValue || '');
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = useContext(FormContext);

    const isHidden = hiddenInputs[textBoxUniqueId];
    const isSkipped = skippedInputs[textBoxUniqueId];
    const [errorMessageText, setErrorMessageText] = useState('');
    let delayTimer: ReturnType<typeof setTimeout>;
    function dispatchValueChanged() {
       clearTimeout(delayTimer);
       delayTimer = setTimeout(function () {
            sfFormValueChanged();
       }, 300);
    }

    function setErrorMessage(_input: HTMLInputElement, message: string | null) {
        if (message) {
            setErrorMessageText(message);
        }
    }

    function clearErrorMessage() {
        setErrorMessageText('');
    }

    const handleTextValidation = (): boolean => {
        const target = inputRef.current!;
        const validationMessages = props.violationRestrictionsMessages;
        const validationRestrictions = props.violationRestrictionsJson;
        setInputValue((target as HTMLInputElement).value);

        if (validationRestrictions) {
            let isValidLength = true;
            if (validationRestrictions.minLength) {
                isValidLength = target.value.length >= validationRestrictions.minLength;
            }

            if (isValidLength && validationRestrictions.maxLength && validationRestrictions.maxLength > 0) {
                isValidLength = target.value.length <= validationRestrictions.maxLength;
            }

            if (!isValidLength) {
                setErrorMessage(target, validationMessages.invalidLength);
                return false;
            }
        }

        if (target.required && target.validity.valueMissing) {
            setErrorMessage(target, validationMessages.required);
            return false;
        } else if (target.validity.patternMismatch && validationMessages.regularExpression) {
            setErrorMessage(target, validationMessages.regularExpression);
            return false;
        } else if (!target.validity.valid) {
            setErrorMessage(target, validationMessages.invalid);
            return false;
        } else {
            clearErrorMessage();
            return true;
        }
    };
    const handleInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue((e.target as HTMLInputElement).value);
        handleTextValidation();
        dispatchValueChanged();
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleTextValidation();
        }
        dispatchValidity(textBoxUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formSubmitted]);

    const rootClass = classNames(
        'mb-3',
        props.cssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible]
        );

    return (<div className={rootClass} data-sf-role="text-field-container">
      <label className="h6" htmlFor={textBoxUniqueId}>{props.label}</label>
      <input id={textBoxUniqueId}
        type={props.inputType}
        className={classNames('form-control',{ [formViewProps.invalidClass!]: formViewProps.invalidClass && errorMessageText })}
        ref={inputRef}
        name={props.fieldName!}
        placeholder={props.placeholderText || ''}
        value={inputValue}
        data-sf-role="text-field-input"
        disabled={isHidden || isSkipped}
        aria-describedby={ariaDescribedByAttribute}
        onChange={handleTextValidation}
        onInput={handleInputEvent}
        onInvalid={handleTextValidation}
        {...props.validationAttributes}
        />
      { props.instructionalText &&
        <div id={textBoxInfoMessageId} className="form-text">{props.instructionalText}</div>
      }
      {errorMessageText && <div id={textBoxErrorMessageId} data-sf-role="error-message" role="alert" aria-live="assertive" className="invalid-feedback" >
        {errorMessageText}
      </div>}
    </div>
    );
}
