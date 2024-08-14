import { Fragment } from 'react';
import { ListWithSummaryViewProps } from './list-with-summary.view-props';
import { OpenDetailsAnchor } from '../open-details-anchor';
import { ContentListEntityBase } from '../../../content-lists-common/content-lists-base.entity';
import { formatDate } from '../../../common/utils';

export function ListWithSummaryView(props: ListWithSummaryViewProps<ContentListEntityBase>) {
    return (
      <div {...props.attributes}>
        {props.items.map((item, index: number) => {
                return (
                  <Fragment key={item.Original.Id}>
                    {index !== 0 && <hr />}
                    <div>
                      {item.Title &&
                        <h5 className={item.Title.Css}>
                          <OpenDetailsAnchor
                            detailPageMode={props.widgetContext.model.Properties.DetailPageMode!}
                            detailPageUrl={props.detailPageUrl}
                            requestContext={props.widgetContext.requestContext}
                            item={item} />
                        </h5>}
                      {item.PublicationDate &&
                        <p className={'text-muted ' + item.PublicationDate.Css}>
                          <small>{formatDate(item.PublicationDate.Value, props.widgetContext.requestContext.culture)}</small>
                        </p>
                            }
                      {item.Text && <p className={item.Text.Css}>{item.Text.Value}</p>}
                    </div>
                  </Fragment>
                );
            })}
      </div>
    );
}

