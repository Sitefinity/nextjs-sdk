import { SearchFacetsClient } from './search-facets-client';
import { SearchFacetsViewProps } from './search-facets.view-props';
import { SearchFacetsEntity } from './search-facets.entity';

export function SearchFacetsDefaultView(props: SearchFacetsViewProps<SearchFacetsEntity>) {
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
