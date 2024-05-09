import { SanitizerService } from '../../../services/sanitizer-service';
import { formatDate } from '../../common/utils';
import { DetailViewModel } from '../../content-lists-common/content-list-models';

export function NewsItemDetail(viewModel: DetailViewModel) {
    const author = viewModel.DetailItem.Author;
    return (
      <>
        <h3>
          <span>{ viewModel.DetailItem?.Title }</span>
        </h3>

        <div>
          { formatDate(viewModel.DetailItem?.PublicationDate, viewModel.Culture) }
          { author && `By ${author}` }
        </div>

        <div>{ viewModel.DetailItem?.Summary }</div>

        <div dangerouslySetInnerHTML={{__html: SanitizerService.sanitizeHtml(viewModel.DetailItem?.Content) as any}} />
      </>
    );
}
