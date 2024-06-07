
import { DetailItem } from '../../editor/detail-item';
import { ContentContext, ContentVariation } from '../../editor/widget-framework/mixed-content-context';
import { CollectionResponse } from '../../rest-sdk/dto/collection-response';
import { SdkItem } from '../../rest-sdk/dto/sdk-item';
import { CombinedFilter } from '../../rest-sdk/filters/combined-filter';
import { FilterClause, FilterOperators } from '../../rest-sdk/filters/filter-clause';
import { FilterConverterService } from '../../rest-sdk/filters/filter-converter';
import { FilterTypes } from '../../rest-sdk/filters/filter-types';
import { OrderBy } from '../../rest-sdk/filters/orderby';
import { RelationFilter } from '../../rest-sdk/filters/relation-filter';
import { RestClient } from '../../rest-sdk/rest-client';
import { ServiceMetadata } from '../../rest-sdk/service-metadata';
import { GetAllArgs } from '../../rest-sdk/args/get-all.args';
import { ContentListEntityBase } from './content-lists-base.entity';
import { RequestContext } from '../../editor/request-context';
import { EMTPY_GUID } from '../../editor/utils/guid';
import { RootUrlService } from '../../rest-sdk/root-url.service';

export class ContentListsCommonRestService {

    static async getItems(entity: ContentListEntityBase, detailItem: DetailItem | undefined, requestContext?: RequestContext, currentPage: number = 1, traceContext?: any): Promise<CollectionResponse<SdkItem>> {
        if (entity.SelectedItems && entity.SelectedItems.Content && entity.SelectedItems.Content.length > 0
            && entity.SelectedItems.Content[0].Variations) {
            const selectedContent = entity.SelectedItems.Content[0];
            const variation = selectedContent.Variations![0];

            let mainFilter = FilterConverterService.getMainFilter(variation);
            mainFilter = ContentListsCommonRestService.modifyFilterOperatorForMainFilter(entity, mainFilter);

            const additionalFilter = entity.FilterExpression;
            const parentFilter = this.getParentFilterExpression(selectedContent, variation, detailItem);
            const classification = requestContext ? await this.getClassificationFilter(entity, requestContext, traceContext) : null;

            const filters: Array<CombinedFilter | FilterClause | RelationFilter | null> = [mainFilter, additionalFilter, parentFilter, classification];
            let bigFilter: CombinedFilter = {
                Operator: entity.SelectionGroupLogicalOperator,
                ChildFilters: filters.filter(x => x) as Array<CombinedFilter | FilterClause>
            };

            const skipAndTakeParams = this.getSkipAndTake(entity, currentPage);
            const getAllArgs: GetAllArgs = {
                skip: skipAndTakeParams.Skip,
                take: skipAndTakeParams.Take,
                count: skipAndTakeParams.Count,
                type: selectedContent.Type,
                provider: variation.Source,
                orderBy: <OrderBy[]>[this.getOrderByExpression(entity)].filter(x => x),
                fields: this.getSelectExpression(entity),
                filter: bigFilter,
                traceContext
            };

            return RestClient.getItems(getAllArgs);
        };

        return Promise.resolve(({ Items: [], TotalCount: 0 }));
    }


    private static getParentFilterExpression(selectedContent: ContentContext, variation: ContentVariation, detailItem: DetailItem | undefined): FilterClause | null {
        let filterByParentExpressionSerialized = null;
        if (variation.DynamicFilterByParent) {
            let parentType = ServiceMetadata.getParentType(selectedContent.Type);

            if (parentType != null && detailItem && detailItem.ItemType === parentType) {
                return <FilterClause>{
                    FieldName: 'ParentId',
                    FieldValue: detailItem.Id,
                    Operator: FilterOperators.Equal
                };
            }
        }

        return filterByParentExpressionSerialized;
    }

    private static getSkipAndTake(entity: ContentListEntityBase, pageNumber: number): { Skip?: number, Take?: number, Count?: boolean, ShowPager?: boolean } {
        let retVal: { Skip?: number, Take?: number, ShowPager?: boolean, Count?: boolean } | null = {};
        let currentPage = 1;

        if (!entity.ListSettings) {
            return retVal;
        }

        switch (entity.ListSettings.DisplayMode) {
            case 'Paging':
                retVal.ShowPager = true;
                retVal.Take = entity.ListSettings.ItemsPerPage;

                currentPage = pageNumber;

                if (currentPage > 1) {
                    retVal.Skip = entity.ListSettings.ItemsPerPage * (currentPage - 1);
                }

                retVal.Count = true;
                break;
            case 'Limit':
                retVal.Take = entity.ListSettings.LimitItemsCount;
                break;
            default:
                break;
        }

        return retVal;
    }

    private static getOrderByExpression(entity: ContentListEntityBase): OrderBy | null {
        if (entity.OrderBy === 'Manually') {
            return null;
        }

        const sortExpression = entity.OrderBy === 'Custom' ?
            entity.SortExpression :
            entity.OrderBy;

        if (!sortExpression) {
            return null;
        }

        let sortExpressionParts = sortExpression.split(' ');
        if (sortExpressionParts.length !== 2) {
            return null;
        }

        let sortOrder = sortExpressionParts[1].toUpperCase();

        let orderBy: OrderBy = {
            Name: sortExpressionParts[0],
            Type: sortOrder
        };

        return orderBy;
    }

    private static getSelectExpression(entity: ContentListEntityBase): string[] {
        if (!entity.SelectExpression) {
            return ['*'];
        }

        const splitExpressions = entity.SelectExpression.split(';');
        const fields = splitExpressions.map((split) => {
            return split.trim();
        });

        return fields;
    }


    private static modifyFilterOperatorForMainFilter(entity: ContentListEntityBase, filter: CombinedFilter | RelationFilter | FilterClause | null): CombinedFilter | RelationFilter | FilterClause | null {
        if (entity.SelectedItems && entity.SelectedItems.Content && entity.SelectedItems?.Content.length > 0 && entity.SelectedItems?.Content[0].Variations) {
            for (let i = 0; i < entity.SelectedItems.Content[0].Variations.length; i++) {
                const variation = entity.SelectedItems.Content[0].Variations[i];

                if (filter && variation.Filter.Key === FilterTypes.Complex) {
                    if (entity.SelectionGroupLogicalOperator === 'AND') {
                        (filter as CombinedFilter).Operator = 'AND';
                    } else {
                        (filter as CombinedFilter).Operator = 'OR';
                    }
                }
            }
        }

        return filter;
    }

    private static async getClassificationFilter(entity: ContentListEntityBase, requestContext: RequestContext, traceContext?: any) {
        const url = requestContext.url;
        const segments = url ? url.split('/') : [];
        const regex = /(^-in-((?:\w|-){1,}),(.+?);?$)+/;
        const matchedSegments = segments.map(x => decodeURIComponent(x)).map(x => x.match(regex)).filter(x => !!x);
        if (matchedSegments.length === 1) {
            const emptyClause = { FieldValue: EMTPY_GUID, FieldName: 'Id', Operator: FilterOperators.Equal };
            const filter: CombinedFilter = {
                ChildFilters: [],
                Operator: 'AND'
            };

            const classificationSegment = matchedSegments[0]![0];
            const distinctFilters = classificationSegment.split(';').map(x => {
                const match = x.match(regex);
                return {
                    taxaName: match![2],
                    taxaUrl: match![3]
                };
            });
            const filterPromises = distinctFilters.map(({ taxaName, taxaUrl }) => {
                return new Promise<FilterClause>(resolve => {
                    const queryParams = RestClient.buildQueryParams({
                        'sf_culture': requestContext.culture,
                        '@param': `'${encodeURIComponent(taxaUrl)}'`
                    });
                    RestClient.sendRequest<{ value: string }>({
                        url: `${RootUrlService.getServerCmsServiceUrl()}/taxonomies/Default.GetTaxonByUrl(taxonomyName='${taxaName}',taxonUrl=@param)${queryParams}`,
                        traceContext
                    }).then(taxonId => {
                        const fieldName = ServiceMetadata.getTaxonomyFieldName(entity.SelectedItems?.Content[0]!.Type!, taxaName);

                        if (fieldName) {
                            resolve({
                                FieldName: fieldName,
                                FieldValue: taxonId?.value,
                                Operator: FilterOperators.ContainsOr
                            });
                        } else {
                            resolve(emptyClause);
                        }
                    });
                });
            });

            return Promise.all(filterPromises).then(x => {
                if (x.includes(emptyClause)) {
                    filter.ChildFilters = [emptyClause];
                } else {
                    filter.ChildFilters = x;
                }
                return filter;
            });
        }

        return Promise.resolve(null);
    }
}
