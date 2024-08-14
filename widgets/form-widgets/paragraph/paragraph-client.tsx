'use client';

import React, { useContext, useState } from 'react';
import { StylingConfig } from '../../styling/styling-config';
import { VisibilityStyle } from '../../styling/visibility-style';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';
import { ParagraphViewProps } from './paragraph.view-props';
import { ParagraphEntity } from './paragraph.entity';
import { getUniqueId } from '../../../editor/utils/getUniqueId';

export function ParagraphClient(props: ParagraphViewProps<ParagraphEntity>) {
    const paragraphUniqueId = props.widgetContext.model.Properties.SfFieldName;
    const paragraphErrorMessageId = getUniqueId('ParagraphErrorMessage', props.widgetContext.model.Id);
    const paragraphInfoMessageId = getUniqueId('ParagraphInfo', props.widgetContext.model.Id);

    let ariaDescribedByAttribute = '';
    if (props.instructionalText) {
        if (props.instructionalText) {
            ariaDescribedByAttribute = `${paragraphUniqueId} ${paragraphErrorMessageId}`;
        } else {
            ariaDescribedByAttribute = paragraphErrorMessageId;
        }
    }

    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const [inputValue, setInputValue] = React.useState(props.predefinedValue || '');
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = useContext(FormContext);
    const isHidden = hiddenInputs[paragraphUniqueId];
    const isSkipped = skippedInputs[paragraphUniqueId];
    const [errorMessageText, setErrorMessageText] = useState('');
    let delayTimer: ReturnType<typeof setTimeout>;
    function dispatchValueChanged() {
       clearTimeout(delayTimer);
       delayTimer = setTimeout(function () {
            sfFormValueChanged();
       }, 300);
    }

    function setErrorMessage(_input: HTMLTextAreaElement, message: string | null) {
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
        setInputValue((target as HTMLTextAreaElement).value);

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
        } else if (!target.validity.valid) {
            setErrorMessage(target, validationMessages.invalid);
            return false;
        } else {
            clearErrorMessage();
            return true;
        }
    };

    const handleInputEvent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue((e.target as HTMLTextAreaElement).value);
        handleTextValidation();
        dispatchValueChanged();
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleTextValidation();
        }
        dispatchValidity(paragraphUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formSubmitted]);

    const rootClass = classNames(
        'mb-3',
        props.cssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible]
        );

    return (<div className={rootClass} data-sf-role="paragraph-text-field-container">
      <label className="h6" htmlFor={paragraphUniqueId}>{props.label}</label>
      <textarea id={paragraphUniqueId}
        ref={inputRef}
        className={classNames('form-control',{
                [formViewProps.invalidClass!]: formViewProps.invalidClass && errorMessageText
            })}
        name={props.fieldName!}
        placeholder={props.placeholderText || undefined}
        value={inputValue}
        data-sf-role="paragraph-text-field-textarea"
        disabled={isHidden || isSkipped}
        aria-describedby={ariaDescribedByAttribute}
        onChange={handleTextValidation}
        onInput={handleInputEvent}
        onInvalid={handleTextValidation}
        {...props.validationAttributes}
        />
      { props.instructionalText &&
        <div id={paragraphInfoMessageId} className="form-text">{props.instructionalText}</div>
      }
      {errorMessageText && <div id={paragraphErrorMessageId} data-sf-role="error-message" role="alert" aria-live="assertive" className="invalid-feedback" >
        {errorMessageText}
      </div>}
    </div>
    );
}
