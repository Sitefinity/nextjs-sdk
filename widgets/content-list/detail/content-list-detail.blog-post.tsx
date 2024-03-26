import { SanitizerService } from '../../../services/sanitizer-service';
import { DetailViewModel } from '../../content-lists-common/content-list-models';

export function BlogPostDetail(viewModel: DetailViewModel) {
    return (<>
      <h3>
        <span>{ viewModel.DetailItem?.Title }</span>
      </h3>

      <div>
        { viewModel.DetailItem?.PublicationDate }
      </div>

      <div>{ viewModel.DetailItem?.Summary }</div>

      <div dangerouslySetInnerHTML={{__html: SanitizerService.sanitizeHtml(viewModel.DetailItem?.Content) as any}} />
    </>
    );
}
