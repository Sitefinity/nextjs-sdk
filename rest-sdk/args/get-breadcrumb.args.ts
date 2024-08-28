import { DetailItem } from '../../editor/detail-item';
import { RequestArgs } from './request.args';

export interface GetBreadcrumbArgs extends RequestArgs {
    addStartingPageAtEnd?: boolean;
    addHomePageAtBeginning?: boolean;
    includeGroupPages?: boolean;
    currentPageId: string;
    detailItemInfo?: DetailItem;
    startingPageId?: string;
    currentPageUrl: string;
    culture?: string;
}
