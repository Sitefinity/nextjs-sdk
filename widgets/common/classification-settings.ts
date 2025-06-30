import { Choice, DataType, Model } from '@progress/sitefinity-widget-designers-sdk';

@Model(true)
export class ClassificationSettings {
    @DataType('string')
    selectedTaxonomyId: string | null = null;

    @DataType('string')
    selectedTaxonomyUrl: string | null = null;

    @DataType('string')
    selectedTaxonomyName: string | null = null;

    @DataType('string')
    selectedTaxonomyTitle: string | null = null;

    @Choice([
        { Value: 'All' },
        { Value: 'TopLevel' },
        { Value: 'UnderParent' },
        { Value: 'Selected' },
        { Value: 'ByContentType' }
    ])
    selectionMode: string = 'All';

    @DataType('enumerable', 'string')
    selectedTaxaIds: string[] | null = null;

    @DataType('string')
    byContentType: string | null = null;
}
