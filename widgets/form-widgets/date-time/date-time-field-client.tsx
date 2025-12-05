'use client';

import React, { useContext, useState } from 'react';
import { VisibilityStyle } from '../../styling/visibility-style';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { DateTimeFieldEntity } from './date-time-field.entity';
import { DateTimeFieldViewProps } from './date-time-field.view-props';

export function DateTimeFieldClient(props: DateTimeFieldViewProps<DateTimeFieldEntity>) {
    const dateTimeFieldUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const dateTimeFieldErrorMessageId = getUniqueId('DateTimeFieldErrorMessage', props.widgetContext.model.Id);
    const dateTimeFieldInfoMessageId = getUniqueId('DateTimeFieldInfo', props.widgetContext.model.Id);
    let ariaDescribedByAttribute = props.hasDescription ? `${dateTimeFieldUniqueId} ${dateTimeFieldErrorMessageId}` : dateTimeFieldErrorMessageId;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState('');
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = useContext(FormContext);

    const isHidden = hiddenInputs[dateTimeFieldUniqueId];
    const isSkipped = skippedInputs[dateTimeFieldUniqueId];
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

    const handleDateTimeValidation = (): boolean => {
        const target = inputRef.current!;
        const validationMessages = props.violationRestrictionsMessages;
        setInputValue((target as HTMLInputElement).value);

        if (target.required && target.validity.valueMissing) {
            setErrorMessage(target, validationMessages.required);
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
        handleDateTimeValidation();
        dispatchValueChanged();
    };

    React.useEffect(() => {
        let isValid = false;
        if (formSubmitted) {
            isValid = handleDateTimeValidation();
        }
        dispatchValidity(dateTimeFieldUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formSubmitted]);

    const rootClass = classNames(
        'mb-3',
        props.cssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible]
    );

    return (
      <div className={rootClass} data-sf-role="date-time-field-container">
        <label className="h6" htmlFor={dateTimeFieldUniqueId}>{props.label}</label>
        <input id={dateTimeFieldUniqueId}
          type={props.inputType}
          className={classNames('form-control', { [formViewProps.invalidClass!]: formViewProps.invalidClass && errorMessageText })}
          ref={inputRef}
          name={props.fieldName!}
          value={inputValue}
          data-sf-role="date-time-field-input"
          disabled={isHidden || isSkipped}
          aria-describedby={ariaDescribedByAttribute}
          onChange={handleDateTimeValidation}
          onInput={handleInputEvent}
          onInvalid={handleDateTimeValidation}
          {...props.validationAttributes}
            />
        {props.instructionalText &&
        <div id={dateTimeFieldInfoMessageId} className="form-text w-100">{props.instructionalText}</div>
            }
        {errorMessageText &&
        <div id={dateTimeFieldErrorMessageId} data-sf-role="error-message" role="alert" aria-live="assertive" className="invalid-feedback" >
          {errorMessageText}
        </div>}
      </div>
    );
}
