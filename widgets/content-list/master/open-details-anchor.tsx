import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { DetailPageSelectionMode } from '../../content-lists-common/detail-page-selection-mode';
import { TransferableRequestContext } from '../../../editor/request-context';

export function OpenDetailsAnchor(props: {
    item: { Original: SdkItem, Title?: {Value?: string} };
    detailPageMode: DetailPageSelectionMode;
    className?: string;
    text?: string;
    detailPageUrl?: string;
    requestContext?: TransferableRequestContext
 }) {
    const item = props.item;
    let url: string | undefined = undefined;

    if (item.Original?.ItemDefaultUrl && props.detailPageUrl) {
        url = props.detailPageUrl + item.Original?.ItemDefaultUrl;

        if (props.detailPageMode === DetailPageSelectionMode.SamePage) {

            if (props.requestContext && props.requestContext.searchParams && Object.keys(props.requestContext.searchParams).length) {
                url += '?' + new URLSearchParams(props.requestContext.searchParams).toString();
            }
        }
    }

    function getItemTitle(item: { Original: SdkItem, Title?: {Value?: string} }) {
        return item.Title?.Value || item.Original['Title'];
    }

    return url ?
            (<a href={url}
              className={props.className}
              >{props.text || getItemTitle(item)}</a>)
            :
            (<>{props.text || getItemTitle(item)}</>);
}
