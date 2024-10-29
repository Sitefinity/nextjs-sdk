import { RequestArgs } from './request.args';

export interface GetTemplatesStatisticsArgs extends RequestArgs {
    templateNames: string[];
}
