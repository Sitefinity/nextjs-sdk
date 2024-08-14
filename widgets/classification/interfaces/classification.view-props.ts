import { ViewPropsBase } from '../../common/view-props-base';
import { ClassificationEntity } from '../classification-entity';
import { TaxonDto } from '../../../rest-sdk/dto/taxon-dto';

export interface ClassificationViewProps<T extends ClassificationEntity> extends ViewPropsBase<T> {
    items: TaxonDto[];
    showItemCount: boolean;
}
