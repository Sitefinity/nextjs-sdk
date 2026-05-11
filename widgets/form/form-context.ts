import { createContext } from 'react';
import { FormViewProps } from './form.view-props';
import { StylingConfig } from '../styling/styling-config';

export const FormContext = createContext<{
    formViewProps: FormViewProps,
    hiddenInputs: {[key:string]: boolean},
    skippedInputs: {[key:string]: boolean},
    disabledSubmitButton: boolean,
    totalFormPages: number,
    currentFormPage: number,
    setCurrentFormPage: (page: number) => void,
    sfFormValueChanged: ()=>void,
    registerFieldValidator: (key: string, validator: () => boolean) => void,
    validateFields: (keys: string[]) => boolean
}>({
    formViewProps: {
        customSubmitAction: false,
        visibilityClasses: StylingConfig.VisibilityClasses,
        invalidClass: StylingConfig.InvalidClass
    },
    sfFormValueChanged: ()=>{},
    registerFieldValidator: () => {},
    validateFields: () => true,
    hiddenInputs: {},
    disabledSubmitButton: false,
    totalFormPages: 0,
    currentFormPage: 0,
    setCurrentFormPage: () => {},
    skippedInputs: {}
});
