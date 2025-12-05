'use client';

import React, { useContext, useState } from 'react';
import { VisibilityStyle } from '../../styling/visibility-style';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { NumberFieldViewProps } from './number-field.view-props';
import { NumberFieldEntity } from './number-field.entity';
import { AffixType } from './interfaces/affix-type';

export function NumberFieldClient(props: NumberFieldViewProps<NumberFieldEntity>) {
    const numberFieldUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const numberFieldErrorMessageId = getUniqueId('NumberFieldErrorMessage', props.widgetContext.model.Id);
    const numberFieldInfoMessageId = getUniqueId('NumberFieldInfo', props.widgetContext.model.Id);
    let ariaDescribedByAttribute = props.hasDescription ? `${numberFieldUniqueId} ${numberFieldErrorMessageId}` : numberFieldErrorMessageId;

    const hasAffix = props.affixType !== AffixType.none && props.affixText;
    let affixId;
    if (hasAffix) {
        affixId = getUniqueId('NumberAffix', props.widgetContext.model.Id);
        ariaDescribedByAttribute = `${ariaDescribedByAttribute} ${affixId}`;
    }

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState(props.predefinedValue || '');
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = useContext(FormContext);

    const isHidden = hiddenInputs[numberFieldUniqueId];
    const isSkipped = skippedInputs[numberFieldUniqueId];
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

    const handleNumberValidation = (): boolean => {
        const target = inputRef.current!;
        const validationMessages = props.violationRestrictionsMessages;
        const validationRestrictions = props.violationRestrictionsJson;
        setInputValue((target as HTMLInputElement).value);

        if (validationRestrictions) {
            let isValidRange = true;
            if (validationRestrictions.minValue || validationRestrictions.minValue === 0) {
                isValidRange = +target.value >= validationRestrictions.minValue;
            }

            if (isValidRange && (validationRestrictions.maxValue || validationRestrictions.maxValue === 0)) {
                isValidRange = +target.value <= validationRestrictions.maxValue;
            }

            if (!isValidRange) {
                setErrorMessage(target, validationMessages.invalidRange);
                return false;
            }
        }

        if (target.required && target.validity.valueMissing) {
            setErrorMessage(target, validationMessages.required);
            return false;
        } else if (target.validity.stepMismatch && validationMessages.step) {
            setErrorMessage(target, validationMessages.step);
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
        handleNumberValidation();
        dispatchValueChanged();
    };

    React.useEffect(() => {
        let isValid = false;
        if (formSubmitted) {
            isValid = handleNumberValidation();
        }
        dispatchValidity(numberFieldUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formSubmitted]);

    const rootClass = classNames(
        'mb-3',
        props.cssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible]
    );

    let prefixEl = props.affixType === AffixType.prefix ? (
      <span className="input-group-text" id={affixId}>{props.affixText}</span>
    ) : null;

    let suffixEl = props.affixType === AffixType.suffix ? (
      <span className="input-group-text" id={affixId}>{props.affixText}</span>
    ) : null;

    const inputElementCssClass = props.affixType === AffixType.none ? props.inputCssClass : '';
    const inputEl = (
      <>
        {prefixEl}
        <input id={numberFieldUniqueId}
          type="number"
          className={classNames('form-control', inputElementCssClass, { [formViewProps.invalidClass!]: formViewProps.invalidClass && errorMessageText })}
          ref={inputRef}
          name={props.fieldName!}
          placeholder={props.placeholderText || ''}
          value={inputValue}
          data-sf-role="number-field-input"
          disabled={isHidden || isSkipped}
          aria-describedby={ariaDescribedByAttribute}
          onChange={handleNumberValidation}
          onInput={handleInputEvent}
          onInvalid={handleNumberValidation}
          {...props.validationAttributes}
            />
        {suffixEl}
      </>
    );

    return (
      <div className={rootClass} data-sf-role="number-field-container">
        <label className="h6" htmlFor={numberFieldUniqueId}>{props.label}</label>

        {hasAffix ? <div className={classNames('input-group', props.inputCssClass)}>{inputEl}</div> : inputEl}

        {props.instructionalText &&
        <div id={numberFieldInfoMessageId} className="form-text">{props.instructionalText}</div>}

        {errorMessageText &&
        <div id={numberFieldErrorMessageId} data-sf-role="error-message" role="alert" aria-live="assertive"
          className={classNames(
                                'invalid-feedback', {
                                [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: true
                            })}>
          {errorMessageText}
        </div>}
      </div>
    );
}
