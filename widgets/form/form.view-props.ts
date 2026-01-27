import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { LayoutServiceResponse } from '../../rest-sdk/dto/layout-service.response';
import { FormDto } from './interfaces/form-dto';
import { FormRuleAction } from './interfaces/form-rule-action';

export interface FormViewProps {
    cssClass?: string;
    formModel?: LayoutServiceResponse;
    submitUrl?: string;
    customSubmitAction: boolean;
    redirectUrl?: string;
    successMessage?: string;
    warning?: string;
    skipDataSubmission?: boolean;
    rules?: string;
    invalidClass?: string;
    hiddenFields?: string;
    attributes?: { [key: string]: Array<{ Key: string, Value: string }> };
    visibilityClasses: { [key: string]: string };
}

const formRuleActionsToEncrypt: { [key: string]: number } = {
    [FormRuleAction.ShowMessage]: 0,
    [FormRuleAction.SendNotification]: 0
};

export function getFormRulesViewProps(form: FormDto): string {
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
    const hiddenFields: string[] = [];
    collectHiddenFields(formModel.ComponentContext.Components, hiddenFields);
    return hiddenFields;
}

function collectHiddenFields(components: WidgetModel<any>[], hiddenFields: string[]) {
    for (const component of components) {
        if (component.Properties.Hidden === 'True' || component.Properties.Hidden === 'true') {
            if (component.Properties.SfFieldName) {
                hiddenFields.push(component.Properties.SfFieldName);
            }
        }

        // Recursively check children (for fields inside layouts/sections)
        if (component.Children && component.Children.length > 0) {
            collectHiddenFields(component.Children, hiddenFields);
        }
    }
}
