import { Fragment } from 'react';
import { ListWithSummaryItemModel, ListWithSummaryViewProps } from './list-with-summary/list-with-summary.view-props';
import { ListWithImageView } from './list-with-image/list-with-image.view';
import { ListWithImageViewProps } from './list-with-image/list-with-image.view-props';
import { ListWithSummaryView } from './list-with-summary/list-with-summary.view';
import { CardsListView } from './cards-list/cards-list.view';
import { CardsListViewProps } from './cards-list/cards-list.view-props';
import { ImageItem } from '../../../rest-sdk/dto/image-item';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { RenderView } from '../../common/render-view';
import { ContentListEntity } from '../content-list-entity';
import { ContentLisMasterProps, ContentListMasterViewProps } from '../../content-lists-common/content-list.view-props';

export function ContentListMaster(props: ContentLisMasterProps<ContentListEntity>) {
    let data: { viewName: string, model: ContentListMasterViewProps<ContentListEntity>} = {} as any;
    const dataItems = props.items;

    if (props.viewName === 'CardsList' || props.viewName === 'ListWithImage') {
        const viewProps = {
            attributes: props.attributes,
            detailPageUrl: props.detailPageUrl,
            widgetContext: props.widgetContext,
            items: dataItems.Items.map((x) => {
                let url!: string;
                const imageProp: ImageItem[] = x[props.fieldMap['Image']];
                let image: ImageItem | null = null;
                if (imageProp && imageProp.length > 0) {
                    image = imageProp[0];
                    if (image.Thumbnails && image.Thumbnails.length > 0) {
                        url = image.Thumbnails[0].Url!;
                    } else {
                        url = image.Url;
                    }
                }

                return {
                    Title: {
                        Value: x[props.fieldMap['Title']],
                        Css: (props.fieldCssClassMap['Title'] || ''),
                        Link: ''
                    },
                    Image: {
                        Title: image?.Title,
                        Url: url,
                        AlternativeText: image?.AlternativeText,
                        Css: props.fieldCssClassMap['Image']
                    },
                    Text: {
                        Value: x[props.fieldMap['Text']],
                        Css: `${props.fieldCssClassMap['Text'] || ''}`
                    },
                    Original: x
                };
            })
        };

        data = { viewName: props.viewName, model: viewProps };
    } else if (props.viewName === 'ListWithSummary') {
        const viewProps = {
            attributes: props.attributes,
            detailPageUrl: props.detailPageUrl,
            widgetContext: props.widgetContext,
            items: dataItems.Items.map((x) => {
                const itemModel = {
                    Title: {
                        Value: x[props.fieldMap['Title']],
                        Css: (props.fieldCssClassMap['Title'] || ''),
                        Link: ''
                    },
                    PublicationDate: {
                        Value: x[props.fieldMap['Publication date']],
                        Css: props.fieldCssClassMap['Publication date']
                    },
                    Text: {
                        Value: x[props.fieldMap['Text']],
                        Css: `${props.fieldCssClassMap['Text'] || ''}`
                    },
                    Original: x
                } as ListWithSummaryItemModel;

                if (!itemModel.PublicationDate.Css) {
                    itemModel.PublicationDate.Css = '';
                }

                return itemModel;
            })
        };

        data = { viewName: props.viewName, model: viewProps };
    } else {
        const fieldMap = props.fieldMap || {};
        const fieldCssMap = props.fieldCssClassMap || {};
        data = {
            viewName: props.viewName,
            model: {
                attributes: props.attributes,
                detailPageUrl: props.detailPageUrl,
                widgetContext: props.widgetContext,
                items: dataItems.Items.map(dataItem => {
                    const item: {Original: SdkItem, [key: string]: any} = { Original: dataItem };
                    Object.keys(fieldMap).forEach(field => {
                        const key = field.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
                        item[key] = {
                            Value: dataItem[fieldMap[field]],
                            Css: fieldCssMap[field]
                        };
                    });
                    return item;
                })
            }
        };
    }

    return (
      <RenderView
        viewName={props.viewName}
        widgetKey={props.widgetContext.model.Name}
        viewProps={data?.model}>
        <Fragment>
          {(data?.model && data?.viewName === 'ListWithImage') &&
            <ListWithImageView {...data?.model as ListWithImageViewProps<ContentListEntity>} />
            }

          {(data?.model && data?.viewName === 'ListWithSummary') &&
            <ListWithSummaryView {...data?.model as ListWithSummaryViewProps<ContentListEntity>} />
            }

          {(data?.model && data?.viewName === 'CardsList') &&
            <CardsListView {...data?.model as CardsListViewProps<ContentListEntity>} />
            }
        </Fragment>
      </RenderView>
    );
}
