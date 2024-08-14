import { formatDate } from '../common/utils';
import { getExtension, getFileExtensionCssClass, getFileSize } from './common/utils';
import { DocumentListEntity } from './document-list-entity';
import { DocumentListDetailViewProps } from './interfaces/document-list-detail.view-props';

export function DocumentDetailItemView(props: DocumentListDetailViewProps<DocumentListEntity>) {
    const sdkItem = props!.item;
    const title = sdkItem['Title'];
    const author = sdkItem['Author'];
    const publicationDate = sdkItem['PublicationDate'] ? new Date(sdkItem['PublicationDate']) : '';
	  const description = sdkItem['Description'];
    const fileSize = getFileSize(sdkItem);
    const extension = getExtension(sdkItem);
    const downloadUrl = sdkItem['Url'];
    const extensionStyle = {
        backgroundColor: `var(${getFileExtensionCssClass(extension)})`
    };
    return (
      <div {...props.attributes}>
        <h1>{title} </h1>
        <div className="text-muted">
          {sdkItem['PublicationDate'] && formatDate(publicationDate, props.culture)}
          {
            author ? author : null  // sanitize
          }
        </div>
        {description &&
          <div className="mt-3">
            {
                description // sanitize
            }
          </div>
        }
        <div className="d-flex gap-3 align-items-center mt-3">
          <div className="position-relative">
            <svg xmlns="https://www.w3.org/2000/svg" width="36" viewBox="0 0 384 512" fill="#a7acb1">
              <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
            </svg>
            <span style={extensionStyle} className="sc-file-icon-extension sc-fs-0625rem text-uppercase ps-1 pe-1 mb-2 text-white">{extension}</span>
          </div>
          <div className="flex-grow-1">
            <div>
              <a href={downloadUrl} target="_blank">{props.downloadLinkLabel}</a>
              <span className="text-muted small">({extension})</span>
            </div>
            <span className="text-muted small">{fileSize}</span>
          </div>
        </div>
      </div>
    );
}
