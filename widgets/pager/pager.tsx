import { PagerViewModel } from './pager-view-model';
import { classNames } from '../../editor/utils/classNames';
import { TransferableRequestContext } from '../../editor/request-context';
import { PagerMode } from '../common/page-mode';
import { pagerLinkAttributes } from './pager-link-attributes';

export interface PagerProps {
  itemsTotalCount: number;
  context: TransferableRequestContext;
  currentPage: number;
  pagerQueryTemplate?: string;
  pagerTemplate?: string;
  itemsPerPage?: number;
  pagerMode: PagerMode;
  navigateFunc?: Function;
}

export function Pager(props: PagerProps) {
  const { itemsTotalCount, context, currentPage } = props;
  const pagerTemplate = props.pagerTemplate || PagerViewModel.PageNumberDefaultTemplate;
  const pagerQueryTemplate = props.pagerQueryTemplate || PagerViewModel.PageNumberDefaultQueryTemplate;

  const pagerModel = new PagerViewModel(
    currentPage,
    itemsTotalCount,
    props.itemsPerPage || 20,
    pagerTemplate,
    pagerQueryTemplate,
    props.pagerMode
  );
  pagerModel.ViewUrl = context.layout.Fields?.ViewUrl;

  return (pagerModel.EndPageIndex > 1 &&
    <div className="mt-2">
      <ul className="pagination">
        {pagerModel.IsPreviousButtonVisible &&
          <li className="page-item">
            <a className="page-link"
              {...pagerLinkAttributes(pagerModel.getPagerUrl(pagerModel.PreviousPageIndex, context), props.navigateFunc)}
              aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        }
        {
          Array.from(
            { length: pagerModel.EndPageIndex - pagerModel.StartPageIndex + 1 },
            (v, k) => k + pagerModel.StartPageIndex).map((pageNumber: number, idx: number) => {
              return (<li key={idx} className={classNames('page-item', {
                'active': pagerModel.CurrentPage === pageNumber
              })}>
                <a className="page-link" {...pagerLinkAttributes(pagerModel.getPagerUrl(pageNumber, context), props.navigateFunc)}>
                  {pageNumber}
                </a>
              </li>);
            })
        }
        {pagerModel.IsNextButtonVisible &&
          <li className="page-item">
            <a className="page-link" {...pagerLinkAttributes(pagerModel.getPagerUrl(pagerModel.NextPageIndex, context), props.navigateFunc)}
              aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        }
      </ul>
    </div>
  );
}
