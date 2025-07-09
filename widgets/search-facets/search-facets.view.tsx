import { SearchFacetsClient } from './search-facets-client';
import { SearchFacetsViewProps } from './search-facets.view-props';
import { SearchFacetsEntity } from './search-facets.entity';
import { RestClient } from '../../rest-sdk/rest-client';
import { setHideEmptyVisual, setWarning } from '../../editor/widget-framework/attributes';
import { Dictionary } from '../../typings/dictionary';
import { SF_WEBSERVICE_API_KEY_HEADER } from '../common/utils';

export async function SearchFacetsDefaultView(props: SearchFacetsViewProps<SearchFacetsEntity>) {
    const additionalHeaders: Dictionary = {};
    if (props.webserviceApiKey) {
        additionalHeaders[SF_WEBSERVICE_API_KEY_HEADER] = props.webserviceApiKey;
    }

    const searchMetadata =  await RestClient.getSearchMetadata({ additionalHeaders });

    if (!searchMetadata.SearchServiceSupportsFacets && props.widgetContext.metadata.editorMetadata) {
      setHideEmptyVisual(props.attributes, true);
      setWarning(props.attributes, 'This widget cannot be used with your current search service. Search facets work only with Azure Search and Elasticsearch services.');
    }

    return (
      <>
        <div
          {...props.attributes}
          >
          <SearchFacetsClient {...props}/>
        </div>
        <input type="hidden" id="sf-currentPageUrl" value={props.widgetContext.requestContext.url || ''} />
      </>
    );
}
