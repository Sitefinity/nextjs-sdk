'use client';

import React, { useContext, useState } from 'react';
import { ChoiceOption } from '../common/choice-option';
import { StylingConfig } from '../../styling/styling-config';
import { VisibilityStyle } from '../../styling/visibility-style';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';

export interface CheckboxesClientViewModel {
    Choices: ChoiceOption[];
    Required: boolean;
    RequiredErrorMessage: string;
    InstructionalText: string;
    Label: string;
    CssClass: string;
    HasAdditionalChoice: boolean;
}

export interface CheckboxesClientProps {
    viewModel: CheckboxesClientViewModel,
    checkboxUniqueId: string;
    inputCheckboxUniqueId: string;
    otherChoiceOptionId: string;
    innerColumnClass: string;
    layoutClass: string;
}

export function CheckboxesClient(props: CheckboxesClientProps) {
    const {viewModel, checkboxUniqueId,
        inputCheckboxUniqueId,
        otherChoiceOptionId, innerColumnClass, layoutClass} = props;
    const otherChoiceInputRef = React.useRef<HTMLInputElement>(null);
    const [inputValues, setInputValues] = React.useState(viewModel.Choices);
    const {
        formViewModel, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = useContext(FormContext);
    const isHidden = hiddenInputs[checkboxUniqueId];
    const isSkipped = skippedInputs[checkboxUniqueId];
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
                Selected: event.target.value.toString() === input.Value?.toString() ? event.target.checked : input.Selected
            };
        });
        setInputValues(newInputValues);

        dispatchValueChanged();
    };

    function handleOtherChange(event: React.ChangeEvent<HTMLInputElement>) {
        setShowOtherInput(event.target.checked);
        dispatchValueChanged();
    }

    function handleOtherInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value){
            clearErrorMessage();
        } else {
            setErrorMessageText(viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label));
        }

        dispatchValueChanged();
    }

    function handleOtherInputInput(event: React.ChangeEvent<HTMLInputElement>) {
        setOtherInputText(event.target.value);
    }

    const hasValueSelected = React.useMemo(()=>{
        return inputValues.some((i: ChoiceOption)=>i.Selected);
    }, [inputValues]);

    const handleChoiceValidation = () => {
        const otherChoiceInput = otherChoiceInputRef.current;

        if ((viewModel.Required && !hasValueSelected) && !(otherChoiceInput && otherChoiceInput.required)) {
            setErrorMessageText(viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label));
            return false;
        }

        if (otherChoiceInput && otherChoiceInput.required && otherChoiceInput.validity.valueMissing) {
            setErrorMessageText(viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label));
            return false;
        }

        return true;
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleChoiceValidation();
        }
        dispatchValidity(checkboxUniqueId, isValid);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formSubmitted]);

    return (<fieldset data-sf-role="checkboxes-field-container"
      className={classNames(
        'mb-3',
        viewModel.CssClass,
        isHidden
            ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
            : StylingConfig.VisibilityClasses[VisibilityStyle.Visible])}
      aria-labelledby={`choice-field-label-${checkboxUniqueId} choice-field-description-${checkboxUniqueId}`}>
      <input type="hidden" data-sf-role="required-validator" value={viewModel.Required.toString()} />
      <legend className="h6" id={`choice-field-label-${checkboxUniqueId}`}>{viewModel.Label}</legend>
      { viewModel.InstructionalText &&
        <p className="text-muted small" id={`choice-field-description-${checkboxUniqueId}`}>{viewModel.InstructionalText}</p>
      }
      <div className={layoutClass}>
        { inputValues.map((choiceOption: ChoiceOption, idx: number)=>{
                const choiceOptionId = `choiceOption-${idx}-${inputCheckboxUniqueId}`;

                return (<div className={`form-check ${innerColumnClass}`} key={idx}>
                  <input className="form-check-input" type="checkbox" name={checkboxUniqueId} id={choiceOptionId}
                    value={choiceOption.Value} data-sf-role="checkboxes-field-input" required={viewModel.Required && !hasValueSelected}
                    checked={!!choiceOption.Selected}
                    disabled={isHidden || isSkipped}
                    onChange={handleChange}
                    />
                  <label className="form-check-label" htmlFor={choiceOptionId}>
                    {choiceOption.Name}
                  </label>
                </div>);
            })
        }
        { viewModel.HasAdditionalChoice &&
        <div className={`form-check ${innerColumnClass}`}>
          <input className="form-check-input mt-1" type="checkbox" name={checkboxUniqueId} id={otherChoiceOptionId}
            data-sf-role="checkboxes-field-input" required={viewModel.Required && !hasValueSelected}
            checked={showOtherInput}
            value={otherInputText}
            onChange={handleOtherChange}/>
          <label className="form-check-label" htmlFor={otherChoiceOptionId}>Other</label>
          {showOtherInput && <input type="text"
            ref={otherChoiceInputRef}
            className={classNames('form-control',{
                [formViewModel.InvalidClass!]: formViewModel.InvalidClass && viewModel.Required && !otherInputText && !hasValueSelected
            })}
            data-sf-role="choice-other-input"
            value={otherInputText}
            required={viewModel.Required}
            disabled={isHidden || isSkipped}
            onChange={handleOtherInputChange}
            onInput={handleOtherInputInput}
          />}
        </div>
        }
      </div>

      {viewModel.Required && errorMessageText && <div data-sf-role="error-message" role="alert" aria-live="assertive"
        className={classNames(
        'invalid-feedback',{
            [StylingConfig.VisibilityClasses[VisibilityStyle.Visible]]: true
        })}
        >
        {errorMessageText}
        </div>
        }
    </fieldset>);
}
