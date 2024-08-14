'use server';

import { Fragment } from 'react';
import { ContentListEntity } from './content-list-entity';
import { ContentListDetail } from './detail/content-list-detail';
import { ContentListMaster } from './master/content-list-master';
import { ContentListsCommonRestService } from '../content-lists-common/content-lists-rest.setvice';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { Pager } from '../pager/pager';
import { htmlAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { DetailItem } from '../../editor/detail-item';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { RequestContext } from '../../editor/request-context';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { getPageNumber } from '../pager/pager-view-model';
import { ServiceMetadata } from '../../rest-sdk/service-metadata';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { FilterOperators } from '../../rest-sdk/filters/filter-clause';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { ContentLisMasterProps, ContentListDetailProps } from '../content-lists-common/content-list.view-props';
import { Dictionary } from '../../typings/dictionary';

export async function ContentList(props: WidgetContext<ContentListEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const model = props.model;
    const properties = model.Properties;
    const type = properties?.SelectedItems?.Content[0].Type;
    if (props.requestContext.isEdit && !model.Caption && type) {
        model.Caption = `Content list - ${ServiceMetadata.getModuleDisplayName(type)}`;
    }

    const context = props.requestContext;
    const pageNumber = getPageNumber(properties.PagerMode, props.requestContext, properties.PagerQueryTemplate, properties.PagerTemplate);
    let detailViewProps: ContentListDetailProps<ContentListEntity> = {} as any;
    let masterViewProps: ContentLisMasterProps<ContentListEntity> = {} as any;
    let isDetailView = false;

    if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Automatic) {
        if (context.detailItem && context.detailItem.ItemType === type && properties.DetailPageMode === DetailPageSelectionMode.SamePage) {
            detailViewProps = handleDetailView(context.detailItem, props);
            isDetailView = true;
        } else {
            const detailProps = await handleShowDetailsViewOnChildDetailsView(props);
            if (detailProps) {
                detailViewProps = detailProps;
                isDetailView = true;
            } else {
                masterViewProps = await handleListView(props, context, pageNumber, ctx);
            }
        }
    } else if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Detail) {
        if (type) {
            const selectedContent = properties!.SelectedItems!.Content[0];
            const itemIdsOrdered = properties!.SelectedItems!.ItemIdsOrdered;
            const detailProps = handleDetailView({
                Id: itemIdsOrdered ? itemIdsOrdered![0]: '',
                ItemType: selectedContent.Type,
                ProviderName: selectedContent.Variations![0]?.Source
            }, props);
            detailViewProps = detailProps;
            isDetailView = true;
        }
    } else if (properties.ContentViewDisplayMode === ContentViewDisplayMode.Master) {
        masterViewProps = await handleListView(props, context, pageNumber, ctx);
    }

    const result = (
      <Fragment>
        { isDetailView && <ContentListDetail {...detailViewProps} /> }
        { !isDetailView && <ContentListMaster {...masterViewProps} /> }
        { !isDetailView && properties.ListSettings?.DisplayMode === ListDisplayMode.Paging &&
        <Pager
          currentPage={pageNumber}
          itemsTotalCount={masterViewProps.items.TotalCount}
          pagerMode={properties.PagerMode}
          itemsPerPage={properties.ListSettings.ItemsPerPage}
          pagerQueryTemplate={properties.PagerQueryTemplate}
          pagerTemplate={properties.PagerTemplate}
          context={context}
                />
            }
        { Tracer.endSpan(span) }
      </Fragment>
    );

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

function getAttributes(props: WidgetContext<ContentListEntity>, fieldName: string): Dictionary {
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

    const attributes = htmlAttributes(props);
    if (props.requestContext.isEdit && props.model.Properties.SelectedItems?.Content?.length && props.model.Properties.SelectedItems?.Content[0].Variations && props.model.Properties.SelectedItems.Content[0].Type) {
        setHideEmptyVisual(attributes, true);
    }

    contentListAttributes.forEach((pair) => {
        attributes[pair.Key] = pair.Value;
    });

    return attributes;
}

function handleDetailView(detailItem: DetailItem, props: WidgetContext<ContentListEntity>) {
    const detailProps: ContentListDetailProps<ContentListEntity> = {
        attributes: getAttributes(props, 'Details view'),
        detailItem: detailItem,
        viewName: props.model.Properties.SfDetailViewName,
        widgetContext: getMinimumWidgetContext(props)
    };

    return detailProps;
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

    let contentListMasterModel: ContentLisMasterProps<ContentListEntity> = {
        detailPageUrl: detailPageUrl,
        fieldCssClassMap: fieldCssClassMap,
        fieldMap: listFieldMapping,
        items: items,
        viewName: props.model.Properties.SfViewName as any,
        attributes: getAttributes(props, 'Content list'),
        widgetContext: getMinimumWidgetContext(props)
    };

    return contentListMasterModel;
}
