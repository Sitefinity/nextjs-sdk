import { LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';
import { PageItem } from '../rest-sdk/dto/page-item';
import { DetailItem } from './detail-item';

export interface RequestContext {
    layout: LayoutServiceResponse;
    searchParams: { [key: string]: string; };
    detailItem?: DetailItem;
    culture: string;
    isEdit: boolean;
    isPreview: boolean;
    isLive: boolean;
    url: string;
    pageNode: PageItem;
}
