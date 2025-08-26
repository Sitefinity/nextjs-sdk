import { MixedContentContext } from '../editor/widget-framework/mixed-content-context';
import { CommonArgs } from '../rest-sdk/args/common.args';
import { GetAllArgs } from '../rest-sdk/args/get-all.args';
import { CollectionResponse } from '../rest-sdk/dto/collection-response';
import { SdkItem } from '../rest-sdk/dto/sdk-item';
import { FilterConverterService } from '../rest-sdk/filters/filter-converter';
import { RestClient } from '../rest-sdk/rest-client';
import { ErrorCodeException } from '../rest-sdk/errors/error-code.exception';

/**
 * RestClientForContext is a class that provides methods to retrieve content items from the value of a property from type {MixedContentContext}.
 * It is used when working with properties of type {MixedContentContext} in the entity of a widget.
 */
export class RestClientForContext {
    /**
     * Retrieves a single item of type T defined by the value of a MixedContentContext object.
     * @param {MixedContentContext} contentContext - The context containing the content data describing the item to be retrieved.
     * @param {Partial<CommonArgs>} [externalArgs] - Optional external arguments to customize the request. 
     * @returns {Promise<T>} A Promise of the requested item of type T if such is found, otherwise throws a "NotFound" error.
     */
    public static async getItem<T extends SdkItem>(contentContext: MixedContentContext, externalArgs?: Partial<CommonArgs>): Promise<T> {
        return this.getItems<T>(contentContext, {
            ...externalArgs,
            type: externalArgs?.type as string,
            traceContext: externalArgs?.traceContext
        }).then((x) => {
            if (x.Items.length === 0) {
                const key = contentContext.ItemIdsOrdered?.length ? contentContext.ItemIdsOrdered[0] : null;
                const errorMessage = key ? `The item with key '${key}' was not found` : 'The item was not found';
                throw new ErrorCodeException('NotFound', errorMessage);
            } else {
                return x.Items[0];
            }
        });
    }

    /**
     * Retrieves a collection of items of type T defined by the value of a MixedContentContext object.
     * @param {MixedContentContext} contentContext - The context containing the content data describing the item to be retrieved.
     * @param {Partial<CommonArgs>} [externalArgs] - Optional external arguments to customize the request. 
     * @returns {Promise<CollectionResponse<T>>} A promise of the collection of the requested items of type T if such mach the criteria, otherwise an empty collection.
     */
    public static async getItems<T extends SdkItem>(contentContext: MixedContentContext, externalArgs?: Partial<GetAllArgs>): Promise<CollectionResponse<T>> {
        if (!contentContext ||
            !contentContext.Content ||
            contentContext.Content.length === 0) {
            return {
                TotalCount: 0,
                Items: []
            };
        }

        const firstContent = contentContext.Content[0];
        if (!firstContent || !firstContent.Variations || !firstContent.Variations[0]) {
            return {
                TotalCount: 0,
                Items: []
            };
        }

        const firstVariation = firstContent.Variations[0];

        let args: GetAllArgs = {
            ...externalArgs,
            type: firstContent.Type || externalArgs?.type as string,
            provider: firstVariation.Source,
            filter: FilterConverterService.getMainFilter(firstVariation),
            traceContext: externalArgs?.traceContext
        };

        if (externalArgs?.orderBy && externalArgs?.orderBy.length > 0) {
            args.orderBy = externalArgs.orderBy;
        }

        if (externalArgs?.culture) {
            args.culture = externalArgs.culture;
        }

        const itemsForContext = await RestClient.getItems<T>(args);

        if (!externalArgs?.orderBy?.length && Array.isArray(contentContext.ItemIdsOrdered)
            && contentContext.ItemIdsOrdered.length > 0 && contentContext.ItemIdsOrdered.length === itemsForContext.Items.length) {
            itemsForContext.Items = RestClientForContext.orderItemsManually<T>(contentContext.ItemIdsOrdered, itemsForContext.Items);
        }

        return itemsForContext;
    };

    private static orderItemsManually<T extends SdkItem>(orderedList: string[], items: T[]): T[] {
        let orderedCollection: T[] = [];

        orderedList.forEach((id: string)=> {
            const orderedItem = items.find((x: any) => x.Id === id);

            if (orderedItem) {
                orderedCollection.push(orderedItem);
            }
        });

        if (orderedCollection.length === items.length){
            items = orderedCollection;
        } else {
            orderedCollection = items;
        }

        return orderedCollection;
    }
}
