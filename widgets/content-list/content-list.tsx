'use server';

import { Fragment } from 'react';
import { ContentListEntity } from './content-list-entity';
import { ContentListDetail } from './detail/content-list-detail';
import { ContentListMaster } from './master/content-list-master';
import { ContentListModelMaster, ContentListModelDetail } from '../content-lists-common/content-list-models';
import { ContentListsCommonRestService } from '../content-lists-common/content-lists-rest.setvice';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { Pager } from '../pager/pager';
import { htmlAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { DetailItem } from '../../editor/detail-item';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RequestContext } from '../../editor/request-context';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { getPageNumber } from '../pager/pager-view-model';
import { ContentListViewModel } from './master/content-list-model-base';
import { ServiceMetadata } from '../../rest-sdk/service-metadata';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { FilterOperators } from '../../rest-sdk/filters/filter-clause';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function ContentList(props: WidgetContext<ContentListEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const model = props.model;
    const properties = model.Properties;
    const type = properties?.SelectedItems?.Content[0].Type;
    if (props.requestContext.isEdit && !model.Caption && type) {
        model.Caption = `Content list - ${ServiceMetadata.getModuleDisplayName(type)}`;
    }

    const attributes = htmlAttributes(props);
    const context = props.requestContext;
    const pageNumber = getPageNumber(properties.PagerMode, props.requestContext, properties.PagerQueryTemplate, properties.PagerTemplate);
    const viewModel: ContentListViewModel = {
        detailModel: null,
        listModel: null,
        entity: properties,
        pagerProps: {
            currentPage: pageNumber,
            itemsTotalCount: 0,
            pagerMode: properties.PagerMode,
            itemsPerPage: properties.ListSettings?.ItemsPerPage || 20,
            pagerQueryTemplate: properties.PagerQueryTemplate,
            pagerTemplate: properties.PagerTemplate,
            context: context,
            traceContext: props.traceContext
        },
        requestContext: context,
        widgetName: model.Name
    };

    if (props.requestContext.isEdit && properties.SelectedItems?.Content?.length && properties.SelectedItems?.Content[0].Variations) {
        setHideEmptyVisual(attributes, true);
    }


    if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Automatic) {
        if (context.detailItem && context.detailItem.ItemType === type && properties.DetailPageMode === DetailPageSelectionMode.SamePage) {
            viewModel.detailModel = handleDetailView(context.detailItem, props);
        } else {
            const detailModel = await handleShowDetailsViewOnChildDetailsView(props);
            if (detailModel) {
                viewModel.detailModel = detailModel;
            } else {
                viewModel.listModel = await handleListView(props, context, pageNumber, ctx);
                viewModel.pagerProps!.itemsTotalCount = viewModel.listModel.Items.TotalCount;
            }
        }
    } else if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Detail) {
        if (type) {
            const selectedContent = properties!.SelectedItems!.Content[0];
            const itemIdsOrdered = properties!.SelectedItems!.ItemIdsOrdered;
            const detailModel = handleDetailView({
                Id: itemIdsOrdered ? itemIdsOrdered![0]: '',
                ItemType: selectedContent.Type,
                ProviderName: selectedContent.Variations![0]?.Source
            }, props);
            viewModel.detailModel = detailModel;
        }
    } else if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Master) {
        viewModel.listModel = await handleListView(props, context, pageNumber, ctx);
        viewModel.pagerProps!.itemsTotalCount = viewModel.listModel.Items.TotalCount;
    }

    const result = (
      <Fragment>
        { viewModel.detailModel && <ContentListDetail viewModel={{...viewModel, traceContext: ctx}} /> }
        { viewModel.listModel && <ContentListMaster viewModel={viewModel} requestContext={props.requestContext} /> }
        { viewModel.listModel && properties.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
        <Pager
          currentPage={pageNumber}
          itemsTotalCount={viewModel.listModel.Items.TotalCount}
          pagerMode={properties.PagerMode}
          itemsPerPage={properties.ListSettings.ItemsPerPage}
          pagerQueryTemplate={properties.PagerQueryTemplate}
          pagerTemplate={properties.PagerTemplate}
          context={context}
          traceContext={ctx}
                />
            }
        { Tracer.endSpan(span) }
      </Fragment>
    );

    if (Object.keys(attributes).length > 0) {
        return (
          <div {...attributes}>
            {result}
          </div>
        );
    }

    return result;
}

async function handleShowDetailsViewOnChildDetailsView(props: WidgetContext<ContentListEntity>) {
    const context = props.requestContext;
    const model = props.model;
    const properties = model.Properties;
    const type = properties?.SelectedItems?.Content[0].Type;

    if (context.detailItem && properties.ShowDetailsViewOnChildDetailsView && type) {
        const childTypes = ServiceMetadata.getChildTypes(type!).flatMap((x, i) => x.map(y => {
            return {
                'value': y,
                'key': i + 1
            };
        }));
        let childTypeInDetails = childTypes.find(x => x.value === context.detailItem?.ItemType);
        if (childTypeInDetails) {
            let childItem = await RestClient.getItem({
                id: context.detailItem.Id,
                type: context.detailItem.ItemType,
                provider: context.detailItem.ProviderName,
                fields: [ 'ItemDefaultUrl' ]
            });

            let parentsTitles = childItem['ItemDefaultUrl'].split('/').filter((x: any) => x);
            let parentTitle = parentsTitles.reverse()[childTypeInDetails.key];

            if (type === RestSdkTypes.Blog) {
                parentTitle = parentsTitles[0];
            }

            let parentItems = await RestClient.getItems({
                type: type!,
                provider: context.detailItem.ProviderName,
                filter: {
                    FieldName: 'UrlName',
                    Operator: FilterOperators.Equal,
                    FieldValue: parentTitle
                }
            });

            if (parentItems.Items.length === 1) {
                return await handleDetailView({
                    Id: parentItems.Items[0].Id,
                    ItemType: type,
                    ProviderName: parentItems.Items[0].Provider
                }, props);
            }
        }
    }

    return null;
}

function getAttributesWithClasses(props: WidgetContext<ContentListEntity>, fieldName: string): Array<{ Key: string, Value: string}> {
    const viewCss = props.model.Properties.CssClasses?.find(x => x.FieldName === fieldName);

    const contentListAttributes = props.model.Properties.Attributes?.ContentList || [];
    let classAttribute = contentListAttributes.find(x => x.Key === 'class');
    if (!classAttribute) {
        classAttribute = {
            Key: 'className',
            Value: ''
        };

        contentListAttributes.push(classAttribute);
    }

    if (viewCss) {
        classAttribute.Value += ` ${viewCss.CssClass}`;
    }

    classAttribute.Value = classAttribute.Value.trim();

    return contentListAttributes;
}

function handleDetailView(detailItem: DetailItem, props: WidgetContext<ContentListEntity>) {
    const contentListAttributes = getAttributesWithClasses(props, 'Details view');

    const detailModel = {
        Attributes: contentListAttributes,
        DetailItem: detailItem,
        ViewName: props.model.Properties.SfDetailViewName
    } as ContentListModelDetail;

    return detailModel;
}

async function handleListView(props: WidgetContext<ContentListEntity>, requestContext: RequestContext, currentPage: number, ctx: any) {
    const listFieldMapping: {[key: string]: string} = {};
    props.model.Properties.ListFieldMapping?.forEach((entry) => {
        listFieldMapping[entry.FriendlyName!] = entry.Name!;
    });

    const fieldCssClassMap: {[key: string]: string} = {};
    props.model.Properties.CssClasses?.forEach((entry) => {
        fieldCssClassMap[entry.FieldName] = entry.CssClass;
    });

    const items = await ContentListsCommonRestService.getItems(props.model.Properties, props.requestContext.detailItem, requestContext, currentPage, ctx, props.model.Properties.ShowListViewOnChildDetailsView);

    let detailPageUrl: string | undefined;
    if (!(props.model.Properties.ContentViewDisplayMode === ContentViewDisplayMode.Master && props.model.Properties.DetailPageMode === DetailPageSelectionMode.SamePage)
        && items.Items.length > 0) {
        detailPageUrl = props.requestContext.pageNode.ViewUrl;
        if (props.model.Properties.DetailPageMode === DetailPageSelectionMode.ExistingPage && props.model.Properties.DetailPage) {
            const detailPage: PageItem = await RestClient.getItem({
                type: RestSdkTypes.Pages,
                id: props.model.Properties.DetailPage.ItemIdsOrdered![0],
                provider: props.model.Properties.DetailPage.Content[0].Variations![0].Source,
                culture: props.requestContext.culture
            });

            detailPageUrl = detailPage.ViewUrl;
        }
    }

    let contentListMasterModel: ContentListModelMaster = {
        DetailPageUrl: detailPageUrl,
        FieldCssClassMap: fieldCssClassMap,
        FieldMap: listFieldMapping,
        Items: items,
        ViewName: props.model.Properties.SfViewName as any,
        Attributes: getAttributesWithClasses(props, 'Content list')
    };

    return contentListMasterModel;
}
