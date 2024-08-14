import { formatDate } from '../../common/utils';
import { ContentListDetailViewProps } from '../../content-lists-common/content-list.view-props';
import { ContentListEntity } from '../content-list-entity';

export function DynamicDetailView(props: ContentListDetailViewProps<ContentListEntity>) {
    return (
      <div {...props.attributes}>
        <h3>
          <span>{ props.detailItem?.Title }</span>
        </h3>

        <div>
          { formatDate(props.detailItem?.PublicationDate, props.widgetContext.requestContext.culture) }
        </div>
      </div>
    );
}
