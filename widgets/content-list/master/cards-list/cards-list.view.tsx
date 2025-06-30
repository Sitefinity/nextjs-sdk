import { CardsListViewProps } from './cards-list.view-props';
import { OpenDetailsAnchor } from '../open-details-anchor';
import { SanitizerService } from '../../../../services/sanitizer-service';
import { ContentListEntity } from '../../content-list-entity';
import { Pager } from '../../../pager/pager';
import { ListDisplayMode } from '../../../../editor/widget-framework/list-display-mode';

export function CardsListView(props: CardsListViewProps<ContentListEntity>) {
    const items = props.items;

    const contentListAttributes = props.attributes;
    const classAttributeName = contentListAttributes['class'] ? 'class' : 'className';
    contentListAttributes[classAttributeName] += ' row row-cols-1 row-cols-md-3';
    contentListAttributes[classAttributeName] = contentListAttributes[classAttributeName].trim();

    return (
      <>
        <div {...contentListAttributes}>
          {items.map(item => {
                  const content = item.Text.Value;
                  return (<div key={item.Original.Id} className="col">
                    <div className="card h-100">
                      {/* Nuxt Image needs width and height - if we can bring them (or use some defaults) we can use it
                          <Image className={item.Image.Css} src={item.Image.Url} alt={item.Image.AlternativeText} title={item.Image.Title} />
                          */}
                      {
                              /* eslint-disable-next-line @next/next/no-img-element */
                        item.Image.Url && <img className={'card-img-top ' + item.Image.Css} src={item.Image.Url} alt={item.Image.AlternativeText} title={item.Image.Title} />
                          }
                      <div className="card-body">
                        <h5 className={'card-title ' + item.Title.Css}>
                          <OpenDetailsAnchor
                            detailPageMode={props.widgetContext.model.Properties?.DetailPageMode!}
                            detailPageUrl={props.detailPageUrl}
                            requestContext={props.widgetContext.requestContext}
                            item={item} />
                        </h5>
                        {item.Text && <p className={'card-text ' + item.Text.Css} dangerouslySetInnerHTML={{ __html: SanitizerService.getInstance().sanitizeHtml(content) as any }} />}
                      </div>
                    </div>
                  </div>);
              })}
        </div>
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
      </>
    );
}
