/* eslint-disable @next/next/no-img-element */
import { ImageClickAction } from './interfaces/image-click-action';
import { ImageDisplayMode } from './interfaces/image-display-mode';
import { ImageViewProps } from './interfaces/image.view-props';
import { Dictionary } from '../../typings/dictionary';
import { StyleGenerator } from '../styling/style-generator.service';
import { ImageEntity } from './image.entity';
import { generateAnchorAttrsFromLink, getCustomAttributes, htmlAttributes } from '../../editor/widget-framework/attributes';

const imageWrapperClass = 'd-inline-block';

export function ImageDefaultView(props: ImageViewProps<ImageEntity>) {
    if (!props.item) {
        return (
          <>
            <div {...props.attributes} />
          </>
        );
    }

    let anchorClass = 'd-inline-block';
    if (props.widgetContext.model.Properties.CssClass) {
        anchorClass = `${'d-inline-block'} ${props.widgetContext.model.Properties.CssClass}`;
    }

    if (props.clickAction === ImageClickAction.OpenOriginalSize) {
        return (
          <a href={props.item.Url} className={anchorClass} {...props.attributes}>
            {renderImageTag(props, {})}
          </a>
        );
    } else if (props.clickAction === ImageClickAction.OpenLink && !!props.widgetContext.model.Properties.ActionLink?.href) {
        const anchorAttributes = generateAnchorAttrsFromLink(props.widgetContext.model.Properties.ActionLink, anchorClass);
        return (
          <a {...anchorAttributes} {...props.attributes}>
            {renderImageTag(props, {})}
          </a>
        );
    } else {
        let viewPropsCssClass = props.widgetContext.model.Properties.CssClass;
        if (props.widgetContext.model.Properties.Margins) {
            let margins = StyleGenerator.getMarginClasses(props.widgetContext.model.Properties.Margins)?.trim();
            if (margins) {
                if (viewPropsCssClass) {
                    viewPropsCssClass = `${viewPropsCssClass} ${margins}`;
                } else {
                    viewPropsCssClass = margins;
                }
            }
        }

        const dataAttributes = htmlAttributes(props.widgetContext);

        return (
          <>
            {renderImageTag(props, dataAttributes, viewPropsCssClass)}
          </>
        );
    }
}

function renderImageTag(imageModel: ImageViewProps<ImageEntity>, dataAttributes: Dictionary, classAttributeValue?: string) {
    let imageClassName: string | undefined = imageModel.fitToContainer ? 'img-fluid' : undefined;
    let imageCustomAttributes = getCustomAttributes(imageModel.widgetContext.model.Properties.Attributes, 'Image');
    const imageAltAttribute = imageModel.alternativeText || undefined;

    if (imageModel.imageSize === ImageDisplayMode.Responsive) {
        let pictureWrapperClass = imageWrapperClass;
        if (classAttributeValue) {
            pictureWrapperClass = `${pictureWrapperClass} ${classAttributeValue}`;
        }

        return (
          <picture className={pictureWrapperClass} {...dataAttributes}>
            {
                    imageModel.thumbnails.map((thumbnail, idx) => {
                        const sourceWidth = imageModel.width && thumbnail.Width !== imageModel.width ? thumbnail.Width : undefined;
                        const sourceHeight = imageModel.height && thumbnail.Height !== imageModel.height ? thumbnail.Height : undefined;
                        if (sourceWidth && sourceHeight) {
                            return (<source key={idx} media={`(max-width: ${thumbnail.Width}px)`}
                              srcSet={thumbnail.Url} type={thumbnail.MimeType}
                              width={sourceWidth}
                              height={sourceHeight}
                            />);
                        }
                    })
                }
            {renderImage(imageCustomAttributes, imageClassName, imageModel.selectedImageUrl, imageModel.title, imageAltAttribute)}
          </picture>
        );
    }

    if (classAttributeValue) {
        if (imageClassName) {
            imageClassName = `${imageClassName} ${classAttributeValue}`;
        } else {
            imageClassName = classAttributeValue;
        }
    }

    if (imageModel.imageSize === ImageDisplayMode.CustomSize || imageModel.imageSize === ImageDisplayMode.Thumbnail) {
        if (imageModel.width) {
            imageCustomAttributes['width'] = imageModel.width.toString();
        }

        if (imageModel.height) {
            imageCustomAttributes['height'] = imageModel.height.toString();
        }
    }

    return (
      <span {...dataAttributes}>
        {renderImage(imageCustomAttributes, imageClassName, imageModel.selectedImageUrl, imageModel.title, imageAltAttribute)}
      </span>
    );
}

function renderImage(attributes: Dictionary, className?: string, src?: string, title?: string, alt?: string) {
    return (
      <img {...attributes}
        loading="lazy" className={className}
        src={src} title={title} alt={alt} />
    );
}
