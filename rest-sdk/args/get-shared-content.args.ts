import { RequestArgs } from './request.args';

export interface getSharedContentArgs extends RequestArgs {
    id: string;
    cultureName: string;
}
