import { Dictionary } from '../../../typings/dictionary';
import { ViewPropsBase } from '../../common/view-props-base';
import { AffixType } from './interfaces/affix-type';
import { NumberFieldEntity } from './number-field.entity';

export interface NumberFieldViewProps<T extends NumberFieldEntity> extends ViewPropsBase<T> {
	label: string | null;
    instructionalText: string | null;
    placeholderText: string | null;
    fieldName: string | null;
    predefinedValue: number | null;
    cssClass: string | null;
    inputCssClass: string | null;
	affixText: string | null;
	affixType: AffixType;
	allowDecimals: boolean | null;
    violationRestrictionsJson: {
        maxValue: number | null,
        minValue: number | null
    };
    violationRestrictionsMessages: {
		invalidRange: string | null,
        required: string | null,
        invalid: string | null,
        step: string | null
    },
    validationAttributes: Dictionary;
    hasDescription: boolean;
}
