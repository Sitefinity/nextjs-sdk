import { SdkItem } from './sdk-item';
import { TaxonomyType } from './taxonomy-type';

export interface TaxonomyDto extends SdkItem {
    Name: string;
    Title: string;
    TaxaUrl: string;
    TaxonName: string;
    Type: TaxonomyType;
}
