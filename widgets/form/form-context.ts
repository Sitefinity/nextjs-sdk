import { createContext } from 'react';
import { FormViewProps } from './form.view-props';
import { StylingConfig } from '../styling/styling-config';

export const FormContext = createContext<{
    formViewProps: FormViewProps,
    hiddenInputs: {[key:string]: boolean},
    skippedInputs: {[key:string]: boolean},
    formSubmitted: boolean,
    disabledSubmitButton: boolean,
    sfFormValueChanged: ()=>void,
    dispatchValidity: (inputKey: string, valid: boolean)=>void,
}>({
    formViewProps: {
        customSubmitAction: false,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass
    },
    sfFormValueChanged: ()=>{},
    dispatchValidity: ()=>{},
    hiddenInputs: {},
    formSubmitted: false,
    disabledSubmitButton: false,
    skippedInputs: {}
});
