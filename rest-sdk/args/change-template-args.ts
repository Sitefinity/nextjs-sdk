import { CommonArgs } from './common.args';

export interface ChangeTemplateArgs extends CommonArgs {
    selectedPages: string[];
    templateId?: string;
    templateName?: string;
}
