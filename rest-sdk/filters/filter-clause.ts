export interface FilterClause {
    FieldName: string,
    FieldValue: any,
    Operator: FilterOperators | string,
}

export enum FilterOperators {
    Equal = 'eq',
    NotEqual = 'ne',
    GreaterThan = 'gt',
    LessThan = 'lt',
    GreaterThanOrEqual = 'ge',
    LessThanOrEqual = 'le',
    ContainsOr = 'any+or',
    ContainsAnd = 'any+and',
    DoesNotContain = 'not+(any+or)',
    In = 'in'
};

export const StringOperators = {
    StartsWith: 'startswith',
    EndsWith: 'endswith',
    Contains: 'contains'
};
