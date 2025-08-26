import { CommonArgs } from './common.args';

export interface GetCommonArgs extends CommonArgs {
    /**
     * The content item's fields to include in the response.
     */
    fields?: string[]
}
