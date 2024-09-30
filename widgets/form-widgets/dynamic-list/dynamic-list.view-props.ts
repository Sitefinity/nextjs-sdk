import { GetAllArgs } from '../../../rest-sdk/args/get-all.args';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { TaxonDto } from '../../../rest-sdk/dto/taxon-dto';
import { RestClient } from '../../../rest-sdk/rest-client';
import { RestClientForContext } from '../../../services/rest-client-for-context';
import { ViewPropsBase } from '../../common/view-props-base';
import { ChoiceOption } from '../common/choice-option';
import { DynamicListEntity } from './dynamic-list.entity';
import { SelectionMode, TaxonSelectionMode } from './selection-modes';
import { ServiceMetadata } from '../../../rest-sdk/service-metadata';

export interface DynamicListViewProps<T extends DynamicListEntity> extends ViewPropsBase<T> {
    label: string | null;
    instructionalText: string | null;
    choices: ChoiceOption[] | null;
    required: boolean;
    fieldName: string;
    cssClass: string | undefined;
    columnsNumber: number;
}

export async function getChoiceItems(entity: DynamicListEntity, traceContext?: any): Promise<ChoiceOption[]> {
    let items: SdkItem[] = [];
    let defaultFieldName: string = 'Title';

    if (entity.ListType === SelectionMode.Classification) {
        items = await getClassifications(entity, traceContext);
    } else if (entity.ListType === SelectionMode.Content) {
        const [itemsFromContent, defaultFieldNameFromContent] = await getContent(entity, traceContext);
        items = itemsFromContent;
        defaultFieldName = defaultFieldNameFromContent ?? defaultFieldName;
    }

    return transformItemsToChoices(items, defaultFieldName, entity);
}


async function getContent(entity: DynamicListEntity, traceContext?: any): Promise<[SdkItem[], string | null]> {
    if (entity.SelectedContent?.Content &&
        entity.SelectedContent.Content.length > 0 &&
        entity.SelectedContent.Content[0].Type != null) {
        const itemType = entity.SelectedContent.Content[0].Type;
        const defaultFieldName = await ServiceMetadata.getDefaultFieldName(itemType);

        const getAllArgs: GetAllArgs = {
            orderBy: [],
            type: itemType,
            traceContext
        };

        const orderBy = getOrderByExpressionForContent(entity);
        if (orderBy !== null) {
            getAllArgs.orderBy!.push(orderBy);
        }

        const itemsResponse = await RestClientForContext.getItems(entity.SelectedContent, getAllArgs);
        return [itemsResponse.Items, defaultFieldName];
    }

    return [[], null];
}

function getOrderByExpressionForContent(entity: DynamicListEntity) {
    if (entity.OrderByContent === 'Manually') {
        return null;
    }

    const sortExpression = entity.OrderByContent === 'Custom' ? entity.SortExpression : entity.OrderByContent;

    if (!sortExpression) {
        return null;
    }

    const sortExpressionParts = sortExpression!.split(' ');
    if (sortExpressionParts.length !== 2) {
        return null;
    }

    const sortOrder = sortExpressionParts[1].toUpperCase() === 'ASC' ? 'asc' : 'desc';
    const orderBy = { Name: sortExpressionParts[0], Type: sortOrder };

    return orderBy;
}

async function getClassifications(entity: DynamicListEntity, traceContext?: any): Promise<TaxonDto[]> {
    const settings = entity.ClassificationSettings;

    if (settings && settings.selectedTaxonomyId) {
        let orderBy = entity.OrderBy || 'Title ASC';

        if (orderBy === 'Custom') {
            orderBy = entity.SortExpression || '';
        } else if (orderBy === 'Manually'){
            orderBy = 'Ordinal';
        }

        return RestClient.getTaxons({
            contentType: settings.byContentType!,
            orderBy: orderBy as string,
            selectionMode: settings.selectionMode,
            taxonomyId: settings.selectedTaxonomyId,
            showEmpty: true,
            taxaIds: settings.selectedTaxaIds!,
            traceContext
        });
    }

    return Promise.resolve([]);
}

function transformItemsToChoices(items: SdkItem[], defaultFieldName: string, entity: DynamicListEntity) : ChoiceOption[] {
    if (!items){
        return [];
    }

    let returnVal: ChoiceOption[] = [];
    const taxa = items as TaxonDto[];
    if (entity.ListType === SelectionMode.Classification && entity.ClassificationSettings?.selectionMode === TaxonSelectionMode.All && taxa != null) {
        getAllTaxa(taxa, defaultFieldName, entity, returnVal);
    } else {
        returnVal = items.map(x => {
            return getOption(x, defaultFieldName, entity);
        });
    }

    return returnVal;
}

function getAllTaxa(taxa: TaxonDto[], defaultFieldName: string, entity: DynamicListEntity, taxaChoices: ChoiceOption[]) {
    taxa.forEach(item => {
        const option = getOption(item, defaultFieldName, entity);
        taxaChoices.push(option);
        getAllTaxa(item.SubTaxa, defaultFieldName, entity, taxaChoices);
    });
}

function getOption(item: SdkItem, defaultFieldName: string, entity: DynamicListEntity) {
    const option: ChoiceOption = {
        Name: item[defaultFieldName],
        Value: entity.ValueFieldName && item[entity.ValueFieldName] ? item[entity.ValueFieldName] : item[defaultFieldName],
        Selected: false
    };

    return option;
}
