import { formatDate } from '../../common/utils';
import { DetailViewModel } from '../../content-lists-common/content-list-models';

export function DynamicDetail(viewModel: DetailViewModel) {
    return (
      <>
        <h3>
          <span>{ viewModel.DetailItem?.Title }</span>
        </h3>

        <div>
          { formatDate(viewModel.DetailItem?.PublicationDate, viewModel.Culture) }
        </div>
      </>
    );
}
