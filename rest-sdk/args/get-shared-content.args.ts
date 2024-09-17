import { RequestArgs } from './request.args';

export interface GetSharedContentArgs extends RequestArgs {
    id: string;
    cultureName: string;
}
