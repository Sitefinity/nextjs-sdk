
import React from 'react';
import { PagerViewModel } from './pager-view-model';
import { classNames } from '../../editor/utils/classNames';
import { RequestContext } from '../../editor/request-context';
import { PagerMode } from '../common/page-mode';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export interface PagerProps {
  itemsTotalCount: number;
  context: RequestContext;
  currentPage: number;
  pagerQueryTemplate?: string;
  pagerTemplate?: string;
  itemsPerPage?: number;
  pagerMode: PagerMode;
  traceContext?: any;
}

export function Pager(props: PagerProps) {
  const { span } = Tracer.startSpan('Pager', false, props.traceContext);
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
  pagerModel.ViewUrl = context.layout.Fields.ViewUrl;

  return (pagerModel.EndPageIndex > 1 &&
    <ul className="pagination">
      {pagerModel.IsPreviousButtonVisible &&
        <li className="page-item">
          <a className="page-link"
            href={pagerModel.getPagerUrl(pagerModel.PreviousPageIndex, context)}
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
              <a className="page-link" href={pagerModel.getPagerUrl(pageNumber, context)}>
                {pageNumber}
              </a>
            </li>);
          })
      }
      {pagerModel.IsNextButtonVisible &&
        <li className="page-item">
          <a className="page-link" href={pagerModel.getPagerUrl(pagerModel.NextPageIndex, context)}
            aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      }
      {Tracer.endSpan(span)}
    </ul>
  );
}
