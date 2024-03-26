import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { LayoutServiceResponse } from '../../rest-sdk/dto/layout-service.response';
import { FormDto } from './interfaces/form-dto';
import { FormRuleAction } from './interfaces/form-rule-action';

export interface FormViewModel {
    CssClass?: string;
    FormModel?: LayoutServiceResponse;
    SubmitUrl?: string;
    CustomSubmitAction: boolean;
    RedirectUrl?: string;
    SuccessMessage?: string;
    Warning?: string;
    SkipDataSubmission?: boolean;
    Rules?: string;
    InvalidClass?: string;
    HiddenFields?: string;
    Attributes?: { [key: string]: Array<{ Key: string, Value: string }> };
    VisibilityClasses: { [key: string]: string };
}

const formRuleActionsToEncrypt: { [key: string]: number } = {
    [FormRuleAction.ShowMessage]: 0,
    [FormRuleAction.SendNotification]: 0
};


export function getFormRulesViewModel(form: FormDto): string {
    if (!form.Rules) {
        return form.Rules;
    }

    const actionIndexList = { ...formRuleActionsToEncrypt };
    const rules = JSON.parse(form.Rules);
    for (const rule of rules) {
        for (const action of rule['Actions']) {
            const ruleAction = action['Action'];
            if (Object.keys(formRuleActionsToEncrypt).includes(ruleAction)) {
                action['Target'] = `sf_${ruleAction}_${actionIndexList[ruleAction]}`;
                actionIndexList[ruleAction]++;
            }
        }
    }

    return JSON.stringify(rules);
}

export function getFormHiddenFields(formModel: LayoutServiceResponse) {
    const hiddenFields = formModel.ComponentContext.Components
        .filter((x: WidgetModel<any>) => x.Properties.Hidden === 'True' || x.Properties.Hidden === 'true')
        .map((x: WidgetModel<any>) => x.Properties.SfFieldName);

    return hiddenFields;
}
