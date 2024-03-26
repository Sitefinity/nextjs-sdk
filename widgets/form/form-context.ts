import { createContext } from 'react';
import { FormViewModel } from './form-view-model';
import { StylingConfig } from '../styling/styling-config';

export const FormContext = createContext<{
    formViewModel: FormViewModel,
    hiddenInputs: {[key:string]: boolean},
    skippedInputs: {[key:string]: boolean},
    formSubmitted: boolean,
    disabledSubmitButton: boolean,
    sfFormValueChanged: ()=>void,
    dispatchValidity: (inputKey: string, valid: boolean)=>void,
}>({
    formViewModel: {
        CustomSubmitAction: false,
        VisibilityClasses: StylingConfig.VisibilityClasses,
        InvalidClass: StylingConfig.InvalidClass
    },
    sfFormValueChanged: ()=>{},
    dispatchValidity: ()=>{},
    hiddenInputs: {},
    formSubmitted: false,
    disabledSubmitButton: false,
    skippedInputs: {}
});
