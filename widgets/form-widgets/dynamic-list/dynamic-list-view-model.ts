import { GetAllArgs } from '../../../rest-sdk/args/get-all.args';
import { SdkItem } from '../../../rest-sdk/dto/sdk-item';
import { TaxonDto } from '../../../rest-sdk/dto/taxon-dto';
import { RestClient } from '../../../rest-sdk/rest-client';
import { RestClientForContext } from '../../../services/rest-client-for-context';
import { ChoiceOption } from '../common/choice-option';
import { DynamicListEntity } from './dynamic-list.entity';
import { SelectionMode } from './selection-modes';

export interface DynamicListViewModel {
    Label: string | null;
    InstructionalText: string | null;
    Choices: ChoiceOption[] | null;
    Required: boolean;
    ViolationRestrictionsMessages: {
        required: string
    } | null;
    FieldName: string;
    CssClass: string | undefined;
    ColumnsNumber: number;
}

export async function getChoiceItems(entity: DynamicListEntity): Promise<ChoiceOption[]> {
    let items: SdkItem[] = [];
    const defaultFieldName: string = 'Title';
    if (entity.ListType === SelectionMode.Classification) {
        items = await getClassifications(entity);
    } else if (entity.ListType === SelectionMode.Content) {
        items = await getContent(entity);
    }

    return transformItemsToChoices(items, defaultFieldName, entity);
}

async function getContent(entity: DynamicListEntity): Promise<SdkItem[]> {
    if (entity.SelectedContent?.Content &&
        entity.SelectedContent.Content.length > 0 &&
        entity.SelectedContent.Content[0].Type != null) {
        const itemType = entity.SelectedContent.Content[0].Type;

        const getAllArgs: GetAllArgs = {
            orderBy: [],
            type: itemType
        };

        const orderBy = getOrderByExpressionForContent(entity);
        if (orderBy !== null) {
            getAllArgs.orderBy!.push(orderBy);
        }

        const itemsResponse = await RestClientForContext.getItems(entity.SelectedContent, getAllArgs);
        return itemsResponse.Items;
    }

    return [];
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

async function getClassifications(entity: DynamicListEntity): Promise<TaxonDto[]> {
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
            taxaIds: settings.selectedTaxaIds!
        });
    }

    return Promise.resolve([]);
}

function transformItemsToChoices(items: SdkItem[], defaultFieldName: string, entity: DynamicListEntity) : ChoiceOption[] {
    if (!items){
        return [];
    }

    const returnVal = items.map(x =>{
        const option: ChoiceOption = {
            Name: x[defaultFieldName],
            Value: entity.ValueFieldName && x[entity.ValueFieldName] ? x[entity.ValueFieldName] : x[defaultFieldName],
            Selected: false
        };


        return option;
    });

    return returnVal;
}
