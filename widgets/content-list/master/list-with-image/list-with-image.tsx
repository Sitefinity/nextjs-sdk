import { Fragment } from 'react';
import { ListWithImageModel } from './list-with-image-model';
import { OpenDetailsAnchor } from '../open-details-anchor';
import { ContentListEntityBase } from '../../../content-lists-common/content-lists-base.entity';

export function ListWithImage(props: { model: ListWithImageModel, entity?: ContentListEntityBase }) {
    const model = props.model;

    return (
      <div {...model.Attributes}>
        {model.Items.map((item, index: number) => {
                return (
                  <Fragment key={item.Original.Id}>
                    {index !== 0 && <hr />}
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        {/* <Image className={item.Image.Css} src={item.Image.Url} alt={item.Image.AlternativeText} title={item.Image.Title} /> */}
                        {
                                     /* eslint-disable-next-line @next/next/no-img-element */
                          item.Image.Url && <img className={'card-img-top ' + item.Image.Css} src={item.Image.Url} alt={item.Image.AlternativeText} title={item.Image.Title} />
                                }
                      </div>
                      <div className="flex-grow-1 ms-3">
                        {item.Title && <h5 className={item.Title.Css}>{item.Title.Value}</h5>}
                        {item.Text && <p className={item.Text.Css}>{item.Text.Value}</p>}
                        {model.DetailPageUrl && <OpenDetailsAnchor
                          detailPageMode={props.entity?.DetailPageMode!}
                          detailPageUrl={model.DetailPageUrl}
                          requestContext={model.RequestContext}
                          className="btn btn-primary"
                          item={item}
                          text={'Learn more'} />}
                      </div>
                    </div>
                  </Fragment>
                );

            })}
      </div>
    );
}
