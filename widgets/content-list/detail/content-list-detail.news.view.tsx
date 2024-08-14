import { SanitizerService } from '../../../services/sanitizer-service';
import { formatDate } from '../../common/utils';
import { ContentListDetailViewProps } from '../../content-lists-common/content-list.view-props';
import { ContentListEntity } from '../content-list-entity';

export function NewsItemDetailView(props: ContentListDetailViewProps<ContentListEntity>) {
    const author = props.detailItem.Author;
    return (
      <div {...props.attributes}>
        <h3>
          <span>{ props.detailItem?.Title }</span>
        </h3>

        <div>
          { formatDate(props.detailItem?.PublicationDate, props.widgetContext.requestContext.culture) }
          { author && `By ${author}` }
        </div>

        <div>{ props.detailItem?.Summary }</div>

        <div dangerouslySetInnerHTML={{__html: SanitizerService.getInstance().sanitizeHtml(props.detailItem?.Content) as any}} />
      </div>
    );
}
