'use client';

import React, { useContext, useState } from 'react';
import { ChoiceOption } from '../common/choice-option';
import { VisibilityStyle } from '../../styling/visibility-style';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';
import { MultipleChoiceEntity } from './multiple-choice.entity';
import { getUniqueId } from '../../../editor/utils/getUniqueId';
import { MultipleChoiceViewProps } from './interfaces/multiple-choice.view-props';

export function MultipleChoiceClient(props: MultipleChoiceViewProps<MultipleChoiceEntity>) {
    const multipleChoiceUniqueId = props.widgetContext.model.Properties.SfFieldName!;
    const inputMultipleChoiceUniqueId = getUniqueId(multipleChoiceUniqueId, props.widgetContext.model.Id);
    const otherChoiceOptionId = getUniqueId(`choiceOption-other-${multipleChoiceUniqueId}`, props.widgetContext.model.Id);

    let layoutClass = '';
    let innerColumnClass = '';
    const parsed = parseInt(props.widgetContext.model.Properties.ColumnsNumber.toString(), 10);
    switch (parsed) {
        case 0:
            layoutClass = 'd-flex flex-wrap';
            innerColumnClass = 'me-2';
            break;
        case 2:
            layoutClass = 'row m-0';
            innerColumnClass = 'col-6';
            break;
        case 3:
            layoutClass = 'row m-0';
            innerColumnClass = 'col-4';
            break;
        default:
            break;
    }

    const [inputValues, setInputValues] = React.useState(props.choices);
    const otherChoiceInputRef = React.useRef<HTMLInputElement>(null);
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = useContext(FormContext);
    const isHidden = hiddenInputs[multipleChoiceUniqueId];
    const isSkipped = skippedInputs[multipleChoiceUniqueId];
    const [errorMessageText, setErrorMessageText] = useState('');
    const [otherInputText, setOtherInputText] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);
    let delayTimer: ReturnType<typeof setTimeout>;
    function dispatchValueChanged() {
       clearTimeout(delayTimer);
       delayTimer = setTimeout(function () {
            sfFormValueChanged();
       }, 300);
    }

    function clearErrorMessage() {
        setErrorMessageText('');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearErrorMessage();
        const newInputValues = [...inputValues].map((input:ChoiceOption)=>{
            return {
                ...input,
                Selected: event.target.value.toString() === input.Value?.toString()
            };
        });
        setInputValues(newInputValues);
        setShowOtherInput(false);
        dispatchValueChanged();
    };

    function handleOtherChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newInputValues = [...inputValues].map(input=>{
            return {
                ...input,
                Selected: false
            };
        });
        setInputValues(newInputValues);
        setShowOtherInput(true);
        dispatchValueChanged();
    }

    function handleOtherInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value){
            clearErrorMessage();
        } else {
            setErrorMessageText(props.requiredErrorMessage.replace('{0}', props.label));
        }

        dispatchValueChanged();
    }

    function handleOtherInputInput(event: React.ChangeEvent<HTMLInputElement>) {
        setOtherInputText(event.target.value);
    }

    const hasValueSelected = React.useMemo(()=>{
        return inputValues.some((i: ChoiceOption)=>i.Selected);
    },[inputValues]);

    const handleChoiceValidation = () => {
        const otherChoiceInput = otherChoiceInputRef.current;

        if ((props.required && !hasValueSelected) && !(otherChoiceInput && otherChoiceInput.required)) {
            setErrorMessageText(props.requiredErrorMessage.replace('{0}', props.label));
            return false;
        }

        if (otherChoiceInput && otherChoiceInput.required && otherChoiceInput.validity.valueMissing) {
            setErrorMessageText(props.requiredErrorMessage.replace('{0}', props.label));
            return false;
        }

        clearErrorMessage();
        return true;
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleChoiceValidation();
        }
        dispatchValidity(multipleChoiceUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formSubmitted]);

    return (
      <fieldset data-sf-role="multiple-choice-field-container"
        className={classNames(
            'mb-3',
            props.cssClass,
            isHidden
                ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
                : StylingConfig.VisibilityClasses[VisibilityStyle.Visible])}
        aria-labelledby={`choice-field-label-${multipleChoiceUniqueId} choice-field-description-${multipleChoiceUniqueId}`}>
        <input type="hidden" data-sf-role="required-validator" value={props.required.toString()} />
        <legend className="h6" id={`choice-field-label-${multipleChoiceUniqueId}`}>{props.label}</legend>
        { props.instructionalText &&
          <p className="text-muted small" id={`choice-field-description-${multipleChoiceUniqueId}`}>{props.instructionalText}</p>
        }
        <div className={layoutClass}>
          { inputValues.map((choiceOption: ChoiceOption, idx: number)=>{
                const choiceOptionId = `choiceOption-${idx}-${inputMultipleChoiceUniqueId}`;

                return (<div className={`form-check ${innerColumnClass}`} key={idx}>
                  <input className="form-check-input" type="radio" name={multipleChoiceUniqueId} id={choiceOptionId}
                    value={choiceOption.Value || ''} data-sf-role="multiple-choice-field-input" required={props.required && !hasValueSelected}
                    checked={choiceOption.Selected || false}
                    disabled={isHidden || isSkipped}
                    onChange={handleChange}
                    />
                  <label className="form-check-label" htmlFor={choiceOptionId}>
                    {choiceOption.Name}
                  </label>
                </div>);
            })
        }
          { props.hasAdditionalChoice &&
            <div className={`form-check ${innerColumnClass}`}>
              <input className="form-check-input mt-1" type="radio" name={multipleChoiceUniqueId} id={otherChoiceOptionId}
                data-sf-role="multiple-choice-field-input" required={props.required && !hasValueSelected}
                checked={showOtherInput}
                value={otherInputText}
                onChange={handleOtherChange}/>
              <label className="form-check-label" htmlFor={otherChoiceOptionId}>Other</label>
              {showOtherInput && <input type="text"
                ref={otherChoiceInputRef}
                className={classNames('form-control',{
                [formViewProps.invalidClass!]: formViewProps.invalidClass && props.required && !otherInputText
            })}
                data-sf-role="choice-other-input"
                value={otherInputText}
                required={props.required}
                onChange={handleOtherInputChange}
                onInput={handleOtherInputInput}
          />}
            </div>
        }
        </div>

        {props.required && errorMessageText && <div data-sf-role="error-message" role="alert" aria-live="assertive"
          className={classNames(
                'invalid-feedback',{
                    [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: true
                })}
            >
          {errorMessageText}
        </div>
        }
      </fieldset>
    );
}
