import { LayoutServiceResponse, PartialLayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';
import { PageItem } from '../rest-sdk/dto/page-item';
import { DetailItem } from './detail-item';

export interface RequestContext<T = LayoutServiceResponse> {
    layout: T;
    searchParams: { [key: string]: string; };
    detailItem?: DetailItem;
    culture: string;
    isEdit: boolean;
    isPreview: boolean;
    isLive: boolean;
    url: string;
    pageNode: PageItem;
}

export type TransferableRequestContext = RequestContext<PartialLayoutServiceResponse>;
