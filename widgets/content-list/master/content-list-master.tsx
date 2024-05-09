import { Fragment } from 'react';
import { ContentListModelMaster } from '../../content-lists-common/content-list-models';
import { ContentListModelbase, ContentListViewModel } from './content-list-model-base';
import { ListWithSummaryItemModel, ListWithSummaryModel } from './list-with-summary/list-with-summary-model';
import { ListWithImage } from './list-with-image/list-with-image';
import { ListWithImageModel } from './list-with-image/list-with-image-model';
import { ListWithSummary } from './list-with-summary/list-with-summary';
import { ContentListEntity } from '../content-list-entity';
import { CardsList } from './cards-list/cards-list';
import { CardsListModel } from './cards-list/cards-list-model';
import { ImageItem } from '../../../rest-sdk/dto/image-item';
import { RenderWidgetService } from '../../../services/render-widget-service';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';

export function ContentListMaster(props: { viewModel: ContentListViewModel }) {
    let data: { viewName?: string, model?: ContentListModelbase} = {};
    const entity = props.viewModel.entity;
    const model = props.viewModel.listModel!;

    let attributes: { [key: string]: string } = {};
    if (model.Attributes) {
        model.Attributes.forEach((pair) => {
            attributes[pair.Key] = pair.Value;
        });
    }
    const dataItems = model.Items;

    if (model.ViewName === 'CardsList' || model.ViewName === 'ListWithImage') {
        const viewModel = {
            Attributes: attributes,
            OpenDetails: model.OpenDetails,
            Items: dataItems.Items.map((x) => {
                let url!: string;
                const imageProp: ImageItem[] = x[model.FieldMap['Image']];
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
                        Value: x[model.FieldMap['Title']],
                        Css: 'card-title' + (x[model.FieldCssClassMap['Title']] || ''),
                        Link: ''
                    },
                    Image: {
                        Title: image?.Title,
                        Url: url,
                        AlternativeText: image?.AlternativeText,
                        Css: x[model.FieldCssClassMap['Image']]
                    },
                    Text: {
                        Value: x[model.FieldMap['Text']],
                        Css: 'card-text ' + `${x[model.FieldCssClassMap['Text']] || ''}`
                    },
                    Original: x
                };
            })
        };

        data = { viewName: model.ViewName, model: viewModel };
    } else if (model.ViewName === 'ListWithSummary') {
        const viewModel = {
            Attributes: attributes,
            OpenDetails: model.OpenDetails,
            Culture: props.viewModel.requestContext.culture,
            Items: dataItems.Items.map((x) => {
                const itemModel = {
                    Title: {
                        Value: x[model.FieldMap['Title']],
                        Css: 'card-title' + (x[model.FieldCssClassMap['Title']] || ''),
                        Link: ''
                    },
                    PublicationDate: {
                        Value: x[model.FieldMap['Publication date']],
                        Css: x[model.FieldCssClassMap['Publication date']]
                    },
                    Text: {
                        Value: x[model.FieldMap['Text']],
                        Css: 'card-text ' + `${x[model.FieldCssClassMap['Text']] || ''}`
                    },
                    Original: x
                } as ListWithSummaryItemModel;

                if (!itemModel.PublicationDate.Css) {
                    itemModel.PublicationDate.Css = '';
                }
                itemModel.PublicationDate.Css += ' text-muted';
                return itemModel;
            })
        };

        data = { viewName: model.ViewName, model: viewModel };
    } else {
        const fieldMap = model.FieldMap || {};
        const fieldCssMap = model.FieldCssClassMap || {};
        data = {
            viewName: model.ViewName,
            model: {
                Attributes: attributes,
                OpenDetails: model.OpenDetails,
                Items: dataItems.Items.map(dataItem => {
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

    const templates = RenderWidgetService.widgetRegistry.widgets['SitefinityContentList']?.templates;

    if (templates && data?.model && data?.viewName && templates[data?.viewName]) {
        return (
          <Fragment>
            {templates[data?.viewName]({entity: entity, model: data?.model})}
          </Fragment>
        );
    }

    return (
      <Fragment>
        {(data?.model && data?.viewName === 'ListWithImage') &&
        <ListWithImage entity={entity} model={data?.model as ListWithImageModel} />
            }

        {(data?.model && data?.viewName === 'ListWithSummary') &&
        <ListWithSummary entity={entity} model={data?.model as ListWithSummaryModel} />
            }

        {(data?.model && data?.viewName === 'CardsList') &&
        <CardsList entity={entity} model={data?.model as CardsListModel} />
            }
      </Fragment>
    );
}
