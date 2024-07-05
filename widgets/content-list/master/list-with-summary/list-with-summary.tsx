import { Fragment } from 'react';
import { ListWithSummaryModel } from './list-with-summary-model';
import { OpenDetailsAnchor } from '../open-details-anchor';
import { ContentListEntityBase } from '../../../content-lists-common/content-lists-base.entity';
import { formatDate } from '../../../common/utils';

export function ListWithSummary(props: { model: ListWithSummaryModel, entity?: ContentListEntityBase }) {
    const model = props.model;
    return (
      <div {...model.Attributes}>
        {model.Items.map((item, index: number) => {
                return (
                  <Fragment key={item.Original.Id}>
                    {index !== 0 && <hr />}
                    <div>
                      {item.Title &&
                        <h5 className={item.Title.Css}>
                          <OpenDetailsAnchor
                            detailPageMode={props.entity?.DetailPageMode!}
                            detailPageUrl={props.model.DetailPageUrl}
                            requestContext={props.model.RequestContext}
                            item={item} />
                        </h5>}
                      {item.PublicationDate &&
                        <p className={'text-muted ' + item.PublicationDate.Css}>
                          <small>{formatDate(item.PublicationDate.Value, model.Culture)}</small>
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

