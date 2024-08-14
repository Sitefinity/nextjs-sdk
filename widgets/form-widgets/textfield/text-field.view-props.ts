import { Dictionary } from '../../../typings/dictionary';
import { ViewPropsBase } from '../../common/view-props-base';
import { TextFieldEntity } from './text-field.entity';

export interface TextFieldViewProps<T extends TextFieldEntity> extends ViewPropsBase<T> {
    label: string | null;
    inputType?: string;
    instructionalText: string | null;
    placeholderText: string | null;
    fieldName: string | null;
    predefinedValue: string | null;
    cssClass: string | null;
    violationRestrictionsJson: {
        maxLength: number | null,
        minLength: number | null
    };
    violationRestrictionsMessages: {
        invalidLength: string | null,
        required: string | null,
        invalid: string | null,
        regularExpression?: string | null
    },
    validationAttributes: Dictionary;
    hasDescription: boolean;
}
