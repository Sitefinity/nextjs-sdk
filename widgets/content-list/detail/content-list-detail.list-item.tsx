import { SanitizerService } from '../../../services/sanitizer-service';
import { DetailViewModel } from '../../content-lists-common/content-list-models';

export function ListItemDetail(viewModel: DetailViewModel) {
    return (
      <>
        <h3>
          <span>{ viewModel.DetailItem?.Title }</span>
        </h3>

        <div dangerouslySetInnerHTML={{__html: SanitizerService.sanitizeHtml(viewModel.DetailItem?.Content) as any}} />
      </>
    );
}
