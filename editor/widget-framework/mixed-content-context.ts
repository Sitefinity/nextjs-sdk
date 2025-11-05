export interface MixedContentContext {
    ItemIdsOrdered?: string[] | null,
    Content: ContentContext[],
    ManualSelectionItems?: {
        Index: number,
        Item: {
            [key: string]: any;
        }
    }[]
}

export interface ContentContext {
    Type: string;
    Variations: ContentVariation[] | null
}

export interface ContentVariation {
    Source: string;
    Filter: { Key: string, Value: string };
    DynamicFilterByParent?: boolean;
}
