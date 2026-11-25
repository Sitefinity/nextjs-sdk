import { SearchFacetsClient } from './search-facets-client';
import { SearchFacetsViewProps } from './search-facets.view-props';
import { SearchFacetsEntity } from './search-facets.entity';
import { RestClient } from '../../rest-sdk/rest-client';
import { setHideEmptyVisual, setWarning } from '../../editor/widget-framework/attributes';
import { SearchMetadataDto } from '../../rest-sdk/dto/search-metadata-dto';

export async function SearchFacetsDefaultView(props: SearchFacetsViewProps<SearchFacetsEntity>) {
    let searchMetadata: SearchMetadataDto;
    try {
        searchMetadata = await RestClient.getSearchMetadata({});
    } catch (error) {
        console.error('Failed to retrieve search metadata for the facets widget.', error);
        setWarning(props.attributes,
            'This widget cannot be displayed because search metadata could not be retrieved. Check the application logs for details.');
        setHideEmptyVisual(props.attributes, true);
        return <div {...props.attributes} />;
    }

    if (!searchMetadata.SearchServiceSupportsFacets) {
        setWarning(props.attributes,
            'This widget cannot be used with your current search service. Search facets work only with Lucene, Azure Search, and Elasticsearch services.');
        setHideEmptyVisual(props.attributes, true);
        return <div {...props.attributes} />;
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
