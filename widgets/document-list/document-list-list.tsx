import { ListDisplayMode } from '../../editor/widget-framework/list-display-mode';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';
import { Pager } from '../pager/pager';
import { getExtension, getFileExtensionCssClass, getFileSize } from './common/utils';
import { DocumentListViewModel } from './interfaces/document-list-view-model';

export function DocumentListList(props: { viewModel: DocumentListViewModel }) {
  const { viewModel } = props;
  const items = viewModel.listModel!.Items.Items;
  return (
    <>
      {items.map((item: SdkItem, idx: number) => {
        const title = item['Title'];
        const fileSize = getFileSize(item);
        const extension = getExtension(item);
        const downloadUrl = item['Url'];
        const itemUrl = `${viewModel.url}${item.ItemDefaultUrl}${viewModel.queryString}`;
        const extensionStyle = {
          backgroundColor: `var(${getFileExtensionCssClass(extension)})`
        };
        return (<div className="d-flex gap-3 align-items-center mb-3" key={idx}>
          <div className="position-relative pt-1">
            <svg xmlns="https://www.w3.org/2000/svg" width="36" viewBox="0 0 384 512" fill="#a7acb1">
              <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
            </svg>
            <span style={extensionStyle}
              className="sc-file-icon-extension text-uppercase ps-1 pe-1 mb-2 text-white small"
            >{extension}</span>
          </div>
          <div className="flex-grow-1">
            {title && <>
              <div>
                {itemUrl && viewModel.renderLinks ?
                  (
                    <a href={itemUrl.toString()}>{title}</a> // sanitize
                  )
                  : (title) // sanitize
                }
                <span className="text-muted small">({extension})</span>
              </div>
            </>
            }
            <div>
              <a href={downloadUrl} target="_blank" className="text-muted small">{viewModel.downloadLinkLabel}</a>
              <span className="text-muted small">({fileSize})</span>
            </div>
          </div>
        </div>);
      })
      }
      {
        viewModel.pagerMode === ListDisplayMode.Paging &&
        <div>
          <Pager {...props.viewModel.pagerProps} />
        </div>
      }
    </>
  );
}
