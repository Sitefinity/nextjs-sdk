import { FacetSettings } from './facet-settings';
import { BasicValueTypes, KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { DataModel, DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { Dialog } from '@progress/sitefinity-widget-designers-sdk/decorators/dialog';

@Model()
export class FacetField {
    @DisplayName('Field')
    @DataType('facetTaxa')
    @DefaultValue(BasicValueTypes.StringArray)
    FacetableFieldNames:string[] = [];

    @Description('[{"Type":1,"Chunks":[{"Value":"Add a name of the facetable field that is","Presentation":[]},{"Value":"visible on your site.","Presentation":[]}]}]')
    @DisplayName('Label')
    @DefaultValue('')
    FacetableFieldLabels: string = '';

    @DisplayName('Configuration')
    @DataType(KnownFieldTypes.PencilButton)
    @Dialog('{"buttons":[{"type":"confirm", "title":"Save"}, {"type":"cancel", "title":"Cancel"}], "urlKey":"settings"}')
    @DataModel(FacetSettings)
    FacetFieldSettings: FacetSettings | null = null;
}
