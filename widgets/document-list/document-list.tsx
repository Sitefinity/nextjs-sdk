import React from 'react';
import { DocumentListEntity } from './document-list-entity';
import { StyleGenerator } from '../styling/style-generator.service';
import { DocumentListModelMaster } from './interfaces/document-list-model-master';
import { DocumentListModelDetail } from './interfaces/document-list-detail-model';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { DocumentListList } from './document-list-list';
import { DocumentListGrid } from './document-list-grid';
import { getPageQueryString, getWhiteListSearchParams } from './common/utils';
import { DocumentDetailItem } from './document-list-detail-item';
import { DocumentListViewModel } from './interfaces/document-list-view-model';
import { ContentListsCommonRestService } from '../content-lists-common/content-lists-rest.setvice';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { DetailItem } from '../../editor/detail-item';
import { RequestContext } from '../../editor/request-context';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { getPageNumber } from '../pager/pager-view-model';
import { RenderWidgetService } from '../../services/render-widget-service';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function DocumentList(props: WidgetContext<DocumentListEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;

    const context = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const documentListCustomAttributes = getCustomAttributes(entity.Attributes, 'Document list');
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    let defaultClass =  '';
    const isGrid = entity.SfViewName === 'DocumentTable';
    const pageNumber = getPageNumber(entity.PagerMode, props.requestContext, entity.PagerQueryTemplate, entity.PagerTemplate);
    const viewModel: DocumentListViewModel = {
        detailModel: null,
        listModel: null,
        pagerMode: entity.ListSettings?.DisplayMode || ListDisplayMode.All,
        renderLinks: !(entity.ContentViewDisplayMode === ContentViewDisplayMode.Master && entity.DetailPageMode === DetailPageSelectionMode.SamePage),
        downloadLinkLabel: entity.DownloadLinkLabel,
        sizeColumnLabel: entity.SizeColumnLabel,
        titleColumnLabel: entity.TitleColumnLabel,
        typeColumnLabel: entity.TypeColumnLabel,
        culture: context.culture,
        pagerProps: {
            context,
            currentPage: pageNumber,
            itemsTotalCount: 0,
            itemsPerPage: entity.ListSettings?.ItemsPerPage,
            pagerMode: entity.PagerMode,
            pagerQueryTemplate: entity.PagerQueryTemplate,
            pagerTemplate: entity.PagerTemplate,
            traceContext: ctx
        }
    };

    if (props.requestContext.isEdit && entity.SelectedItems?.Content?.length && entity.SelectedItems?.Content[0].Variations) {
        setHideEmptyVisual(dataAttributes, true);
    }


     if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Automatic) {
         if (context.detailItem) {
            const viewCss = entity.CssClasses?.find(x => x.FieldName === 'Details view');
            defaultClass = viewCss ? viewCss.CssClass : '';
            viewModel.detailModel = await handleDetailView(context.detailItem, entity, context, ctx);
         } else {
            const fieldName = isGrid ? 'Document table' : 'Document list';
            const viewCss = entity.CssClasses?.find(x => x.FieldName === fieldName);
            defaultClass = viewCss ? viewCss.CssClass : '';
            viewModel.listModel = await handleListView(entity, context, pageNumber, ctx);
            viewModel.pagerProps.itemsTotalCount = viewModel.listModel?.Items.TotalCount;
         }
     } else if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Detail) {
        if (entity.SelectedItems && entity.SelectedItems.Content && entity.SelectedItems.Content.length > 0) {
            const selectedContent = entity.SelectedItems.Content[0];
            const itemIdsOrdered = entity.SelectedItems.ItemIdsOrdered;
            const detailModel = await handleDetailView({
                Id: itemIdsOrdered ? itemIdsOrdered![0]: '',
                ItemType: selectedContent.Type,
                ProviderName: selectedContent.Variations![0].Source
            }, entity, context, ctx);
            viewModel.detailModel = detailModel;
            const viewCss = entity.CssClasses?.find(x => x.FieldName === 'Details view');
            defaultClass = viewCss ? viewCss.CssClass : '';
        }
    } else if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Master) {
        viewModel.listModel = await handleListView(entity, context, pageNumber, ctx);
        viewModel.pagerProps.itemsTotalCount = viewModel.listModel?.Items.TotalCount;
    }

   let url: string = '';
   const whitelistedQueryParams = ['sf_site','sfaction','sf_provider','sf_culture'];
   const queryList = new URLSearchParams(getWhiteListSearchParams(context.searchParams || {}, whitelistedQueryParams));
   let queryString = '?' + queryList.toString();

    if (!context.isEdit) {
        if (entity && entity.DetailPageMode === DetailPageSelectionMode.SamePage) {
            url = context.layout.Fields ? context.layout.Fields.ViewUrl : context.layout.MetaInfo.CanonicalUrl;
        } else if (entity && entity.DetailPage) {
            const page = await RestClient.getItem({
                type: RestSdkTypes.Pages,
                id: entity.DetailPage.ItemIdsOrdered![0],
                provider: entity.DetailPage.Content[0].Variations![0].Source,
                traceContext: ctx
            });

            url = page.RelativeUrlPath;
            queryString = getPageQueryString(page as PageItem);
        }
    }

    viewModel.url = url;
    viewModel.queryString = queryString;

    dataAttributes['className'] = classNames(
        defaultClass,
        marginClass,
        documentListCustomAttributes.class
    );

    const templates = RenderWidgetService.widgetRegistry.widgets['SitefinityDocumentList']?.templates;
    const detailTemplate = (templates && templates[entity.SfDetailViewName]) || DocumentDetailItem;
    const masterTemplate = (templates && templates[entity.SfViewName]) || (isGrid ? DocumentListGrid : DocumentListList);

    return (
      <div
        {...documentListCustomAttributes}
        {...dataAttributes}
      >
        { viewModel.detailModel && detailTemplate({viewModel}) }
        { viewModel.listModel && masterTemplate({viewModel}) }
        { Tracer.endSpan(span) }
      </div>
    );
}

 const handleDetailView = async (
    detailItem: DetailItem,
    entity: DocumentListEntity,
    context: RequestContext,
    traceContext: any
 ) => {
    let item;
    if (context.detailItem) {
        item = await RestClient.getItem({
            type: detailItem.ItemType,
            id: detailItem.Id,
            provider: detailItem.ProviderName,
            traceContext
        });
    } else {
        const items = await ContentListsCommonRestService.getItems(entity, detailItem, undefined, undefined, traceContext);
        item = items.Items[0];
    }

    const detailModel = {
        DetailItem: detailItem,
        item: item,
        ViewName: entity.SfDetailViewName
    } as DocumentListModelDetail;

    return detailModel;
};

 const handleListView = async (entity: DocumentListEntity, context: RequestContext, currentPage: number, traceContext: any) => {
    const items = await ContentListsCommonRestService.getItems(entity, context.detailItem, context, currentPage, traceContext);
    const DocumentListMasterModel: DocumentListModelMaster = {
        OpenDetails: !(entity.ContentViewDisplayMode === ContentViewDisplayMode.Master && entity.DetailPageMode === 'SamePage'),
        Items: items
    };

     return DocumentListMasterModel;
 };
