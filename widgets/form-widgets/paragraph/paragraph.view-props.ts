import { Dictionary } from '../../../typings/dictionary';
import { ViewPropsBase } from '../../common/view-props-base';
import { ParagraphEntity } from './paragraph.entity';

export interface ParagraphViewProps<T extends ParagraphEntity> extends ViewPropsBase<T> {
    label: string | null;
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
    },
    validationAttributes: Dictionary;
    hasDescription: boolean;
}
