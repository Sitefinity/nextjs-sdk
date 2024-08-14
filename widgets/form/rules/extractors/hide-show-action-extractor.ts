import { FormRuleActionExecutor } from './form-rule-action-extractor';
import { FormRuleConstants } from '../form-rule-constants';
import { ContextInterface } from '../../interfaces/context-interface';
import { ActionData } from '../../interfaces/action-data';

export class HideShowFieldFormRuleActionExecutor implements FormRuleActionExecutor {
    public actionName: string;

    constructor(actionName: string) {
        if (actionName === FormRuleConstants.Actions.Show || actionName === FormRuleConstants.Actions.Hide) {
            this.actionName = actionName;
        } else {
            throw new Error('Invalid action name! Only ' + FormRuleConstants.Actions.Show + ' and ' + FormRuleConstants.Actions.Hide + ' action names are allowed');
        }
    }

    public applyState(context: ContextInterface, actionData: ActionData) {
        let fieldIndex = context.helper.fieldIndexOf(context.fields, actionData.target);
        let fieldControlId = context.fields[fieldIndex].fieldControlId;
        if (context.fields[fieldIndex].visible) {
            context.helper.showField(context, fieldControlId);
        } else {
            context.helper.hideField(context, fieldControlId);
        }
    };

    public updateState(context: ContextInterface, actionData: ActionData) : boolean {
        let updated = false;
        let fieldIndex = context.helper.fieldIndexOf(context.fields, actionData.target);
        if (this.actionName === FormRuleConstants.Actions.Show && !context.fields[fieldIndex].visible) {
            context.fields[fieldIndex].visible = true;
            updated = true;
        } else if (this.actionName === FormRuleConstants.Actions.Hide && context.fields[fieldIndex].visible) {
            context.fields[fieldIndex].visible = false;
            updated = true;
        }

        return updated;
    };

    public undoUpdateState(context: ContextInterface, actionData: ActionData) {
        let fieldIndex = context.helper.fieldIndexOf(context.fields, actionData.target);
        if (this.actionName === FormRuleConstants.Actions.Show) {
            context.fields[fieldIndex].visible = false;
        } else {
            context.fields[fieldIndex].visible = true;
        }
    };

    public isConflict(actionData: any, otherActionData: any): boolean {
        return (otherActionData.name === FormRuleConstants.Actions.Show || otherActionData.name === FormRuleConstants.Actions.Hide) && actionData.target === otherActionData.target;
    };

    public getActionFieldIds(actionData: any) {
        return [actionData.target];
    };
}
