import { SanitizerService } from '../../../services/sanitizer-service';
import { ContentListDetailViewProps } from '../../content-lists-common/content-list.view-props';
import { ContentListEntity } from '../content-list-entity';

export function ListItemDetailView(props: ContentListDetailViewProps<ContentListEntity>) {
    return (
      <div {...props.attributes}>
        <h3>
          <span>{ props.detailItem?.Title }</span>
        </h3>

        <div dangerouslySetInnerHTML={{__html: SanitizerService.getInstance().sanitizeHtml(props.detailItem?.Content) as any}} />
      </div>
    );
}
