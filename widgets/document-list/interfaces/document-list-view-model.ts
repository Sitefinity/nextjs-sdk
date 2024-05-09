import { ListDisplayMode } from '../../../editor/widget-framework/list-display-mode';
import { PagerProps } from '../../pager/pager';
import { DocumentListModelDetail } from './document-list-detail-model';
import { DocumentListModelMaster } from './document-list-model-master';

export interface DocumentListViewModel {
    listModel: DocumentListModelMaster | null;
    detailModel: DocumentListModelDetail | null;
    renderLinks?: boolean;
    downloadLinkLabel?: string;
    sizeColumnLabel?: string;
    titleColumnLabel?: string;
    typeColumnLabel?: string;
    pagerProps: PagerProps
    pagerMode: ListDisplayMode,
    url?: string;
    queryString?: string;
    culture?: string;
}
