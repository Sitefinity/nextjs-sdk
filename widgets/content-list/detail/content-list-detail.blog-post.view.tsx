import { SanitizerService } from '../../../services/sanitizer-service';
import { formatDate } from '../../common/utils';
import { ContentListDetailViewProps } from '../../content-lists-common/content-list.view-props';
import { ContentListEntity } from '../content-list-entity';

export function BlogPostDetailView(props: ContentListDetailViewProps<ContentListEntity>) {
    return (
      <div {...props.attributes}>
        <h3>
          <span>{ props.detailItem?.Title }</span>
        </h3>

        <div>
          { formatDate(props.detailItem?.PublicationDate, props.widgetContext.requestContext.culture) }
        </div>

        <div>{ props.detailItem?.Summary }</div>

        <div dangerouslySetInnerHTML={{__html: SanitizerService.getInstance().sanitizeHtml(props.detailItem?.Content) as any}} />
      </div>
    );
}
