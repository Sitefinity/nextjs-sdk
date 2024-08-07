import { DetailViewModel } from '../../content-lists-common/content-list-models';
import { BlogPostDetail } from './content-list-detail.blog-post';
import { DynamicDetail } from './content-list-detail.dynamic';
import { EventDetail } from './content-list-detail.event';
import { ListItemDetail } from './content-list-detail.list-item';
import { NewsItemDetail } from './content-list-detail.news';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { RestClient } from '../../../rest-sdk/rest-client';
import { RenderWidgetService } from '../../../services/render-widget-service';
import { ContentListViewModel } from '../master/content-list-model-base';
import { ItemArgs } from '../../../rest-sdk/args/item.args';

export async function ContentListDetail(props: { viewModel: ContentListViewModel }) {
    const model = props.viewModel.detailModel!;
    const queryParams: { [key: string]: string } = props.viewModel.requestContext.searchParams || {};
    const itemArgs: ItemArgs = {
        type: model.DetailItem.ItemType,
        id: model.DetailItem.Id,
        provider: model.DetailItem.ProviderName,
        traceContext: props.viewModel.traceContext,
        culture: props.viewModel.requestContext.culture
    };
    let dataItem: SdkItem;

    if (queryParams.hasOwnProperty('sf-content-action')) {
        if (queryParams['sf-auth']) {
          queryParams['sf-auth'] = encodeURIComponent(queryParams['sf-auth']);
        }

        itemArgs.additionalQueryParams = queryParams;
        dataItem = await RestClient.getItemWithStatus(itemArgs);
    } else {
        dataItem = await RestClient.getItem(itemArgs);
    }

    let detailViewModel: DetailViewModel;
    const attributes: { [key: string]: string } = {};
    if (model.Attributes) {
        model.Attributes.forEach((pair) => {
            attributes[pair.Key] = pair.Value;
        });
    }

    detailViewModel = {
        Attributes: attributes,
        ViewName: model.ViewName,
        DetailItem: dataItem,
        Culture: props.viewModel.requestContext.culture
    };

    const templates = RenderWidgetService.widgetRegistry.widgets[props.viewModel.widgetName]?.templates;

    if (templates && detailViewModel?.ViewName && templates[detailViewModel?.ViewName]) {
        return (
          <div {...detailViewModel?.Attributes}>
            {templates[detailViewModel?.ViewName](detailViewModel)}
          </div>
        );
    }

    return (
      <div {...detailViewModel?.Attributes}>
        {detailViewModel?.ViewName === 'Details.BlogPosts.Default' && BlogPostDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.Dynamic.Default' && DynamicDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.Events.Default' && EventDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.ListItems.Default' && ListItemDetail(detailViewModel)}
        {detailViewModel?.ViewName === 'Details.News.Default' && NewsItemDetail(detailViewModel)}
      </div>
    );
}
