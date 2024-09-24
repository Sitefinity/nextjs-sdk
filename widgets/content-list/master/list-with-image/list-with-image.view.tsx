import { Fragment } from 'react';
import { ListWithImageViewProps } from './list-with-image.view-props';
import { OpenDetailsAnchor } from '../open-details-anchor';
import { ContentListEntityBase } from '../../../content-lists-common/content-lists-base.entity';
import { Pager } from '../../../pager/pager';
import { ListDisplayMode } from '../../../../editor/widget-framework/list-display-mode';

export function ListWithImageView(props: ListWithImageViewProps<ContentListEntityBase>) {
    return (
      <>
        <div {...props.attributes}>
          {props.items.map((item, index: number) => {
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
                          {props.detailPageUrl && <OpenDetailsAnchor
                            detailPageMode={props.widgetContext.model.Properties?.DetailPageMode!}
                            detailPageUrl={props.detailPageUrl}
                            requestContext={props.widgetContext.requestContext}
                            className="btn btn-primary"
                            item={item}
                            text={'Learn more'} />}
                        </div>
                      </div>
                    </Fragment>
                  );

              })}
          { props.widgetContext.model.Properties.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
          <Pager
            currentPage={props.pageNumber}
            itemsTotalCount={props.totalCount}
            pagerMode={props.widgetContext.model.Properties.PagerMode}
            itemsPerPage={props.widgetContext.model.Properties.ListSettings.ItemsPerPage}
            pagerQueryTemplate={props.widgetContext.model.Properties.PagerQueryTemplate}
            pagerTemplate={props.widgetContext.model.Properties.PagerTemplate}
            context={props.widgetContext.requestContext}
                  />
              }
        </div>
      </>
    );
}
