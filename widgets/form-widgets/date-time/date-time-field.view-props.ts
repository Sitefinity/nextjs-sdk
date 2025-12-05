import { HTMLInputTypeAttribute } from 'react';
import { Dictionary } from '../../../typings/dictionary';
import { ViewPropsBase } from '../../common/view-props-base';
import { DateTimeFieldEntity } from './date-time-field.entity';

export interface DateTimeFieldViewProps<T extends DateTimeFieldEntity> extends ViewPropsBase<T> {
	label: string | null;
    inputType: HTMLInputTypeAttribute;
    instructionalText: string | null;
    fieldName: string | null;
    cssClass: string | null;
    violationRestrictionsMessages: {
        required: string | null,
        invalid: string | null,
    },
    validationAttributes: Dictionary;
    hasDescription: boolean;
}
