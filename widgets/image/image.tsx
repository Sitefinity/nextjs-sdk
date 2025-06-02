/* eslint-disable @next/next/no-img-element */
import { ImageClickAction } from './interfaces/image-click-action';
import { ImageDisplayMode } from './interfaces/image-display-mode';
import { ImageViewProps } from './interfaces/image.view-props';
import { ImageEntity } from './image.entity';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { ImageItem } from '../../rest-sdk/dto/image-item';
import { ThumbnailItem } from '../../rest-sdk/dto/thumbnail-item';
import { RestClient, RestSdkTypes } from '../../rest-sdk/rest-client';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../common/render-view';
import { ImageDefaultView } from './image.view';
import { ErrorCodeException } from '../../rest-sdk/errors/error-code.exception';

export async function Image(props: WidgetContext<ImageEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity: ImageEntity = props.model.Properties;

    let imageItem: ImageItem | undefined = undefined;
    if (entity.Item && entity.Item.Id) {
        try {
            imageItem = await RestClient.getItemWithFallback<ImageItem>({
                type: RestSdkTypes.Image,
                id: entity.Item.Id.toString(),
                provider: entity.Item.Provider,
                traceContext: ctx,
                culture: props.requestContext.culture
            });
        } catch (error) {
            const errorMessage = error instanceof ErrorCodeException ? error.message : error as string;
            const attributes = htmlAttributes(props, errorMessage);
            return (props.requestContext.isEdit ? <div {...attributes} /> : null);
        }
    }

    const dataAttributes = htmlAttributes(props);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Image');
    let viewProps: ImageViewProps<ImageEntity> = {
        item: imageItem,
        title: entity.Title,
        alternativeText: entity.AlternativeText,
        clickAction: entity.ClickAction || ImageClickAction.DoNothing,
        imageSize: entity.ImageSize || ImageDisplayMode.Responsive,
        fitToContainer: entity.FitToContainer === undefined ? true : entity.FitToContainer,
        attributes: {...dataAttributes, ...customAttributes},
        thumbnails: [],
        actionLink: '',
        widgetContext: getMinimumWidgetContext(props)
    };

    if (imageItem) {
        viewProps.title = viewProps.title || imageItem.Title;
        viewProps.alternativeText = viewProps.alternativeText || imageItem.AlternativeText;

        const isSvg = imageItem.MimeType === 'image/svg+xml';
        const hasZeroDimensions = imageItem.Width === 0 && imageItem.Height === 0;
        viewProps.width = isSvg && hasZeroDimensions ? undefined : imageItem.Width;
        viewProps.height = isSvg && hasZeroDimensions ? undefined : imageItem.Height;
        viewProps.selectedImageUrl = imageItem.Url;

        if (imageItem.Thumbnails) {
            viewProps.thumbnails = imageItem.Thumbnails.sort((a: ThumbnailItem, b: ThumbnailItem) => a.Width - b.Width);
            if (entity.ImageSize === ImageDisplayMode.Thumbnail) {
                if (imageItem.Thumnail) {
                    viewProps.selectedImageUrl = imageItem.Thumnail.Url;
                }

                let selectedThumbnail = imageItem.Thumbnails.find((t: ThumbnailItem) => t.Title === entity.Thumnail!.Name);
                if (selectedThumbnail) {
                    viewProps.selectedImageUrl = selectedThumbnail.Url as string;
                    viewProps.width = selectedThumbnail.Width;
                    viewProps.height = selectedThumbnail.Height;
                }
            }
        }

        // Thumbnails for images imported from DAM providers are not stored in Sitefinity and we do not know their width and height.
        // We have to set width and heigth to null otherwise the image is zoomed and selected thumbnail not applied correctly.
        if (entity.ImageSize === ImageDisplayMode.Thumbnail && imageItem.IsDamMedia) {
            viewProps.width = undefined;
            viewProps.height = undefined;
        }
    }

    if (entity.CustomSize && entity.ImageSize === ImageDisplayMode.CustomSize) {
        viewProps.width = entity.CustomSize.Width;
        viewProps.height = entity.CustomSize.Height;
    }

    return (
      <RenderView
        viewName={props.model.Properties.ViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <ImageDefaultView {...viewProps} />
      </RenderView>
    );
}
