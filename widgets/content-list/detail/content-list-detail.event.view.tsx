import { SanitizerService } from '../../../services/sanitizer-service';
import { ContentListDetailViewProps } from '../../content-lists-common/content-list.view-props';
import { ContentListEntity } from '../content-list-entity';

export function EventDetailView(props: ContentListDetailViewProps<ContentListEntity>) {
    const city = props.detailItem?.City;
    const country = props.detailItem?.Country;
    const street = props.detailItem?.Street;
    const contactName = props.detailItem?.ContactName;
    const contactPhone = props.detailItem?.ContactPhone;
    const contactCell = props.detailItem?.ContactCell;
    const contactEmail = props.detailItem?.ContactEmail;
    const contactWeb = props.detailItem?.ContactWeb;
    const location = props.detailItem?.Location;
    const description = props.detailItem?.Description;
    const summary = props.detailItem?.Summary;
    const content = props.detailItem?.Content;

    return (
      <div {...props.attributes}>
        <h3 className="sf-event-title">
          <span>{ props.detailItem?.Title }</span>
        </h3>
        <span className="sf-event-type" style={{background: props.detailItem?.Parent?.Color, display: 'inline-block', height: '20px', width: '20px'}} />

        {(city || country ) && (<address>
          { (() => {
                if (city && !country) {
                    return (
                      <>
                        { city } <span>,</span> {country}
                        <br />
                      </>
                    );
                } else {
                    return (
                      <>
                        {!city ? country : city}<br />
                      </>
                    );
                }
            })()
            }
            { street && street}
        </address>)
    }

        <div>
          { contactName && (
            <>
              { contactName }
              <br />
            </>
                )
            }
          { contactPhone && (
            <>
              { contactPhone }
              <br />
            </>
                )
            }
          { contactCell && (
            <>
              { contactCell }
              <br />
            </>
                )
            }

          { contactEmail && (<address><a href={`mailto:${contactEmail}`} target="_blank">{ contactEmail }</a></address>) }
          { contactWeb && (<a href={contactWeb} target="_blank">{ contactWeb }</a>) }
        </div>

        { location && (<p>{ location }</p>) }
        { description && (<p>{ description }</p>) }
        { summary && (<p>{ summary }</p>) }
        { content && (<p dangerouslySetInnerHTML={{__html: SanitizerService.getInstance().sanitizeHtml(content) as any}} />) }
      </div>
    );
}
