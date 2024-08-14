import { FormRuleActionExecutor } from '../rules/extractors/form-rule-action-extractor';
import { ActionData } from './action-data';

export interface Action {
    visible?: boolean;
    data: ActionData;
    fieldControlId?: string;
    executor: FormRuleActionExecutor;
    applyRule?: boolean;
};
