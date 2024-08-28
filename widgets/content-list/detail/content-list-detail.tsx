import { ContentListDetailProps, ContentListDetailViewProps } from '../../content-lists-common/content-list.view-props';
import { BlogPostDetailView } from './content-list-detail.blog-post.view';
import { DynamicDetailView } from './content-list-detail.dynamic.view';
import { EventDetailView } from './content-list-detail.event.view';
import { ListItemDetailView } from './content-list-detail.list-item.view';
import { NewsItemDetailView } from './content-list-detail.news.view';
import { RestClient } from '../../../rest-sdk/rest-client';
import { RenderView } from '../../common/render-view';
import { ItemArgs } from '../../../rest-sdk/args/item.args';
import { ContentListEntity } from '../content-list-entity';

export async function ContentListDetail(props: ContentListDetailProps<ContentListEntity>) {
    const queryParams: { [key: string]: string } = props.widgetContext.requestContext.searchParams || {};
    const itemArgs: ItemArgs = {
        type: props.detailItem.ItemType,
        id: props.detailItem.Id,
        provider: props.detailItem.ProviderName,
        traceContext: props.widgetContext.traceContext,
        culture: props.widgetContext.requestContext.culture,
        fields: extractFieldsFromExpression(props.widgetContext.model.Properties.DetailItemSelectExpression)
    };

    const viewProps: ContentListDetailViewProps<ContentListEntity> = {
      widgetContext: props.widgetContext,
      attributes: props.attributes,
      detailItem: {} as any
    };

    if (queryParams.hasOwnProperty('sf-content-action')) {
        if (queryParams['sf-auth']) {
          queryParams['sf-auth'] = encodeURIComponent(queryParams['sf-auth']);
        }

        itemArgs.additionalQueryParams = queryParams;
        viewProps.detailItem = await RestClient.getItemWithStatus(itemArgs);
    } else {
      viewProps.detailItem = await RestClient.getItem(itemArgs);
    }

    return (
      <RenderView
        viewName={props.viewName}
        widgetKey={props.widgetContext.model.Name}
        viewProps={{ ...viewProps }}>
        {props.viewName === 'Details.BlogPosts.Default' && <BlogPostDetailView {...viewProps} />}
        {props.viewName === 'Details.Dynamic.Default' && <DynamicDetailView {...viewProps} />}
        {props.viewName === 'Details.Events.Default' && <EventDetailView {...viewProps} />}
        {props.viewName === 'Details.ListItems.Default' && <ListItemDetailView {...viewProps} />}
        {props.viewName === 'Details.News.Default' && <NewsItemDetailView {...viewProps} />}
      </RenderView>
    );
}

function extractFieldsFromExpression(selectExpression: string): string[] {
    const fields: string[] =[];
    if (selectExpression) {
        selectExpression.split(';').filter(x => x).forEach(x => {
            fields.push(x.trim());
        });
    }

    return fields.length > 0 ? fields : ['*'];
}
