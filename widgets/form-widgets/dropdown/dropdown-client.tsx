'use client';

import React from 'react';
import { StylingConfig } from '../../styling/styling-config';
import { VisibilityStyle } from '../../styling/visibility-style';
import { classNames } from '../../../editor/utils/classNames';
import { FormContext } from '../../form/form-context';
import { ChoiceOption } from '../common/choice-option';
import { DropdownEntity } from './dropdown.entity';
import { DropdownViewProps } from './interfaces/dropdown.view-props';

export function DropdownFieldSet(props: DropdownViewProps<DropdownEntity>) {
    const dropdownUniqueId = props.sfFieldName;
    const {
        formViewProps, sfFormValueChanged, dispatchValidity,
        hiddenInputs, skippedInputs,
        formSubmitted
    } = React.useContext(FormContext);
    const selectRef = React.useRef<HTMLSelectElement>(null);
    const initiallySelectedItem = props.choices.find((ch: ChoiceOption) => ch.Selected);
    const [selectValue, setSelectValue] = React.useState(initiallySelectedItem ? initiallySelectedItem.Value : '');
    const [errorMessageText, setErrorMessageText] = React.useState('');
    const isHidden = hiddenInputs[dropdownUniqueId];
    const isSkipped = skippedInputs[dropdownUniqueId];
    let delayTimer: ReturnType<typeof setTimeout>;
    function dispatchValueChanged() {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function () {
             sfFormValueChanged();
        }, 300);
     }

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        handleDropdownValidation();
        const selectedItem = props.choices.find(ch => ch.Value?.toString() === event.target.value);

        setSelectValue(selectedItem ? selectedItem.Value : '');
        dispatchValueChanged();
    };

    const handleDropdownValidation = () => {
        const select = selectRef.current!;
        if (props.required && select.value === '') {
            setErrorMessageText(props.requiredErrorMessage.replace('{0}', props.label));
            return false;
        } else {
            setErrorMessageText('');
        }

        return true;
    };

    React.useEffect(()=>{
        let isValid = false;
        if (formSubmitted) {
            isValid = handleDropdownValidation();
        }
        dispatchValidity(dropdownUniqueId, isValid);
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
      <fieldset data-sf-role="dropdown-list-field-container" className={rootClass}
        aria-labelledby={`choice-field-label-${dropdownUniqueId} choice-field-description-${dropdownUniqueId}`}>

        <legend className="h6" id={`choice-field-label-${dropdownUniqueId}`}>{props.label}</legend>

        <select
          className={classNames('form-select',{
                [formViewProps.invalidClass!]: formViewProps.invalidClass && props.required && errorMessageText
          })}
          ref={selectRef}
          data-sf-role="dropdown-list-field-select"
          name={dropdownUniqueId}
          required={props.required}
          value={selectValue}
          disabled={isHidden || isSkipped}
          onChange={handleDropdownChange}>
          { props.choices.map((choiceOption: ChoiceOption, idx: number) => {
            return <option key={idx} value={choiceOption.Value || ''}>{choiceOption.Name}</option>;
            })
           }
        </select>
        { props.instructionalText &&
        <p className="text-muted small mt-1" id={`choice-field-description-${dropdownUniqueId}`}>
          {props.instructionalText}
        </p>
        }
        {errorMessageText && <div data-sf-role="error-message" role="alert" aria-live="assertive" className="invalid-feedback" >
          {errorMessageText}
        </div>
        }
      </fieldset>
    );
}

