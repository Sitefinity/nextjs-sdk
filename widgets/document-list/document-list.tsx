import { DocumentListEntity } from './document-list-entity';
import { StyleGenerator } from '../styling/style-generator.service';
import { DocumentListMasterViewProps } from './interfaces/document-list-master.view-props';
import { DocumentListDetailViewProps } from './interfaces/document-list-detail.view-props';
import { ContentViewDisplayMode } from '../content-lists-common/content-view-display-mode';
import { DetailPageSelectionMode } from '../content-lists-common/detail-page-selection-mode';
import { DocumentListListView } from './document-list-list.view';
import { DocumentListGridView } from './document-list-grid.view';
import { getPageQueryString } from './common/utils';
import { DocumentDetailItemView } from './document-list-detail-item.view';
import { ContentListsCommonRestService } from '../content-lists-common/content-lists-rest.setvice';
import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { DetailItem } from '../../editor/detail-item';
import { TransferableRequestContext } from '../../editor/request-context';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { PageItem } from '../../rest-sdk/dto/page-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { getPageNumber } from '../pager/pager-view-model';
import { RenderView } from '../common/render-view';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RestClientForContext } from '../../services/rest-client-for-context';
import { getWhiteListSearchParams } from '../common/utils';

export async function DocumentList(props: WidgetContext<DocumentListEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;

    const context = props.requestContext;
    const dataAttributes = htmlAttributes(props);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Document list');
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    let defaultClass =  '';
    const isGrid = entity.SfViewName === 'DocumentTable';
    const pageNumber = getPageNumber(entity.PagerMode, props.requestContext, entity.PagerQueryTemplate, entity.PagerTemplate);

    let detailViewProps: DocumentListDetailViewProps<DocumentListEntity> = {} as any;
    let masterViewProps: DocumentListMasterViewProps<DocumentListEntity> = {} as any;
    let isDetailView = false;

    if (props.requestContext.isEdit && entity.SelectedItems?.Content?.length && entity.SelectedItems?.Content[0].Variations) {
        setHideEmptyVisual(dataAttributes, true);
    }

     if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Automatic) {
         if (context.detailItem) {
            const viewCss = entity.CssClasses?.find(x => x.FieldName === 'Details view');
            defaultClass = viewCss ? viewCss.CssClass : '';
            detailViewProps = await handleDetailView(context.detailItem, entity, context, ctx);
            isDetailView = true;
         } else {
            const fieldName = isGrid ? 'Document table' : 'Document list';
            const viewCss = entity.CssClasses?.find(x => x.FieldName === fieldName);
            defaultClass = viewCss ? viewCss.CssClass : '';
            masterViewProps = await handleListView(entity, context, pageNumber, ctx);
         }
     } else if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Detail) {
        if (entity.SelectedItems && entity.SelectedItems.Content && entity.SelectedItems.Content.length > 0) {
            const selectedContent = entity.SelectedItems.Content[0];
            const itemIdsOrdered = entity.SelectedItems.ItemIdsOrdered;
            detailViewProps = await handleDetailView({
                Id: itemIdsOrdered ? itemIdsOrdered![0]: '',
                ItemType: selectedContent.Type,
                ProviderName: selectedContent.Variations![0].Source
            }, entity, context, ctx);
            const viewCss = entity.CssClasses?.find(x => x.FieldName === 'Details view');
            defaultClass = viewCss ? viewCss.CssClass : '';
            isDetailView = true;
        }
    } else if (entity.ContentViewDisplayMode === ContentViewDisplayMode.Master) {
        masterViewProps = await handleListView(entity, context, pageNumber, ctx);
    }

    dataAttributes['className'] = classNames(
        defaultClass,
        marginClass,
        customAttributes.class
    );

    detailViewProps.attributes = { ...dataAttributes, ...customAttributes};
    detailViewProps.widgetContext = getMinimumWidgetContext(props);
    masterViewProps.attributes = { ...dataAttributes, ...customAttributes};
    masterViewProps.widgetContext = getMinimumWidgetContext(props);

    const detailTemplate = (
      <RenderView
        viewName={entity.SfDetailViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={detailViewProps}>
        <DocumentDetailItemView {...detailViewProps} />
      </RenderView>
    );

    const masterTemplate = (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={masterViewProps}>
        {isGrid ? <DocumentListGridView {...masterViewProps} /> : <DocumentListListView {...masterViewProps} />}
      </RenderView>
    );

    return (
      <>
        { isDetailView && detailTemplate }
        { !isDetailView && masterTemplate }
      </>
    );
}

 const handleDetailView = async (
    detailItem: DetailItem,
    entity: DocumentListEntity,
    context: TransferableRequestContext,
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

    const detailViewProps: DocumentListDetailViewProps<DocumentListEntity> = {
        detailItem: detailItem,
        item: item,
        viewName: entity.SfDetailViewName,
        downloadLinkLabel: entity.DownloadLinkLabel,
        culture: context.culture,
        attributes: {},
        widgetContext: {} as any
    };

    return detailViewProps;
};

 const handleListView = async (entity: DocumentListEntity, context: TransferableRequestContext, currentPage: number, traceContext: any) => {
    const items = await ContentListsCommonRestService.getItems(entity, context.detailItem, context, currentPage, traceContext);
    const viewProps: DocumentListMasterViewProps<DocumentListEntity> = {
        items: items,
        pagerMode: entity.ListSettings?.DisplayMode || ListDisplayMode.All,
        renderLinks: !(entity.ContentViewDisplayMode === ContentViewDisplayMode.Master && entity.DetailPageMode === DetailPageSelectionMode.SamePage),
        sizeColumnLabel: entity.SizeColumnLabel,
        titleColumnLabel: entity.TitleColumnLabel,
        typeColumnLabel: entity.TypeColumnLabel,
        downloadLinkLabel: entity.DownloadLinkLabel,
        pagerProps: {
            context,
            currentPage,
            itemsTotalCount: items.TotalCount,
            itemsPerPage: entity.ListSettings?.ItemsPerPage,
            pagerMode: entity.PagerMode,
            pagerQueryTemplate: entity.PagerQueryTemplate,
            pagerTemplate: entity.PagerTemplate
        },
        attributes: {},
        widgetContext: {} as any
    };

    const whitelistedQueryParams = ['sf_site','sfaction','sf_provider','sf_culture'];
    const queryList = new URLSearchParams(getWhiteListSearchParams(context.searchParams || {}, whitelistedQueryParams));
    viewProps.queryString = '?' + queryList.toString();

    if (!context.isEdit) {
        if (entity && entity.DetailPageMode === DetailPageSelectionMode.SamePage) {
            viewProps.url = context.layout.Fields ? context.layout.Fields.ViewUrl : context.layout.MetaInfo.CanonicalUrl;
        } else if (entity && entity.DetailPage) {
            const detailPages = await RestClientForContext.getItems<PageItem>(entity.DetailPage, {
                type: RestSdkTypes.Pages,
                culture: context.culture
            });

            if (detailPages.Items.length === 1) {
                viewProps.url = detailPages.Items[0].RelativeUrlPath;
                viewProps.queryString = getPageQueryString(detailPages.Items[0] as PageItem);
            } else {
                viewProps.renderLinks = false;
            }
        }
    }

    return viewProps;
};
