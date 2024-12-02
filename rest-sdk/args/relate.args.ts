import { CommonArgs } from './common.args';

export interface RelateArgs extends CommonArgs {
    id: string;
    relatedItemId: string;
    relationName: string;
    relatedItemProvider?: string;
}
