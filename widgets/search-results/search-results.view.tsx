'use client';

import { useSearchParams } from 'next/navigation';
import { SearchResultsViewProps } from './interfaces/search-results.view-props';
import { SearchResultsClient } from './search-results-client';
import { SearchResultsEntity } from './search-results.entity';

export function SearchResultsDefaultView(props: SearchResultsViewProps<SearchResultsEntity>) {
    const queryParams = useSearchParams();
    const context = props.widgetContext.requestContext;

    return (queryParams.get('searchQuery') || context.isEdit) && (
      <div className={props.cssClass}
        {...props.attributes}>
        <SearchResultsClient {...props} />
      </div>
      ) || null;
}
