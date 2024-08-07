'use client';

import React, { useContext, useState } from 'react';
import { ChoiceOption } from '../common/choice-option';
import { VisibilityStyle } from '../../styling/visibility-style';
import { StylingConfig } from '../../styling/styling-config';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';

export interface MultipleChoiceClientViewModel {
    Choices: ChoiceOption[];
    RequiredErrorMessage: string;
    Label: string;
    CssClass: string;
    Required: boolean;
    InstructionalText: string;
    HasAdditionalChoice: boolean;
}

export interface MultipleChoiceClientProps {
    viewModel: MultipleChoiceClientViewModel;
    multipleChoiceUniqueId: string;
    inputMultipleChoiceUniqueId: string;
    otherChoiceOptionId: string;
    innerColumnClass: string;
    layoutClass: string;
}

export function MultipleChoiceClient(props: MultipleChoiceClientProps) {
    const {viewModel, multipleChoiceUniqueId,
        inputMultipleChoiceUniqueId,
        otherChoiceOptionId, innerColumnClass, layoutClass} = props;

    const [inputValues, setInputValues] = React.useState(viewModel.Choices);
    const otherChoiceInputRef = React.useRef<HTMLInputElement>(null);
    const {
        formViewModel, sfFormValueChanged, dispatchValidity,
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
            setErrorMessageText(viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label));
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

        if ((viewModel.Required && !hasValueSelected) && !(otherChoiceInput && otherChoiceInput.required)) {
            setErrorMessageText(viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label));
            return false;
        }

        if (otherChoiceInput && otherChoiceInput.required && otherChoiceInput.validity.valueMissing) {
            setErrorMessageText(viewModel.RequiredErrorMessage.replace('{0}', viewModel.Label));
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
            viewModel.CssClass,
            isHidden
                ? StylingConfig.VisibilityClasses[VisibilityStyle.Hidden]
                : StylingConfig.VisibilityClasses[VisibilityStyle.Visible])}
        aria-labelledby={`choice-field-label-${multipleChoiceUniqueId} choice-field-description-${multipleChoiceUniqueId}`}>
        <input type="hidden" data-sf-role="required-validator" value={viewModel.Required.toString()} />
        <legend className="h6" id={`choice-field-label-${multipleChoiceUniqueId}`}>{viewModel.Label}</legend>
        { viewModel.InstructionalText &&
          <p className="text-muted small" id={`choice-field-description-${multipleChoiceUniqueId}`}>{viewModel.InstructionalText}</p>
        }
        <div className={layoutClass}>
          { inputValues.map((choiceOption: ChoiceOption, idx: number)=>{
                const choiceOptionId = `choiceOption-${idx}-${inputMultipleChoiceUniqueId}`;

                return (<div className={`form-check ${innerColumnClass}`} key={idx}>
                  <input className="form-check-input" type="radio" name={multipleChoiceUniqueId} id={choiceOptionId}
                    value={choiceOption.Value} data-sf-role="multiple-choice-field-input" required={viewModel.Required && !hasValueSelected}
                    checked={choiceOption.Selected}
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
              <input className="form-check-input mt-1" type="radio" name={multipleChoiceUniqueId} id={otherChoiceOptionId}
                data-sf-role="multiple-choice-field-input" required={viewModel.Required && !hasValueSelected}
                checked={showOtherInput}
                value={otherInputText}
                onChange={handleOtherChange}/>
              <label className="form-check-label" htmlFor={otherChoiceOptionId}>Other</label>
              {showOtherInput && <input type="text"
                ref={otherChoiceInputRef}
                className={classNames('form-control',{
                [formViewModel.InvalidClass!]: formViewModel.InvalidClass && viewModel.Required && !otherInputText
            })}
                data-sf-role="choice-other-input"
                value={otherInputText}
                required={viewModel.Required}
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
      </fieldset>
    );
}
