import { ImageItem } from '../../../rest-sdk/dto/image-item';
import { ThumbnailItem } from '../../../rest-sdk/dto/thumbnail-item';
import { ViewPropsBase } from '../../common/view-props-base';
import { ImageEntity } from '../image.entity';
import { ImageClickAction } from './image-click-action';
import { ImageDisplayMode } from './image-display-mode';

export interface ImageViewProps<T extends ImageEntity> extends ViewPropsBase<T> {
    item?: ImageItem;
    clickAction: ImageClickAction;
    selectedImageUrl?: string;
    title?: string;
    alternativeText?: string;
    actionLink: string;
    imageSize: ImageDisplayMode;
    fitToContainer: boolean;
    thumbnails: ThumbnailItem[];
    width?: number;
    height?: number;
}
