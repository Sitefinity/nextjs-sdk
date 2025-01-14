
import { CollectionResponse } from './dto/collection-response';
import { SdkItem } from './dto/sdk-item';
import { RestSdkTypes, RestClient } from './rest-client';
import { RootUrlService } from './root-url.service';

export class ServiceMetadata {
    public static serviceMetadataCache: ServiceMetadataDefinition;
    public static serviceMetadataHash: string;
    public static taxonomies: SdkItem[];

    public static async fetch(metadataHash: string, traceContext?: any): Promise<ServiceMetadataDefinition> {
        if (!ServiceMetadata.serviceMetadataCache || metadataHash !== ServiceMetadata.serviceMetadataHash) {
            const serviceUrl = RootUrlService.getServerCmsServiceUrl();
            const metadataUrl = `${serviceUrl}/sfmeta`;
            const metadata = await RestClient.sendRequest<ServiceMetadataDefinition>({ url: metadataUrl, traceContext });
            ServiceMetadata.serviceMetadataCache = metadata;

            const taxonomies = await RestClient.getItems({
                type: RestSdkTypes.Taxonomies,
                traceContext
            });

            ServiceMetadata.taxonomies = taxonomies.Items;
            ServiceMetadata.serviceMetadataHash = metadataHash;
        }

        return ServiceMetadata.serviceMetadataCache;
    }

    public static getDefaultFieldName(typeFullName: string)  {
        const entitySet = this.getSetNameFromType(typeFullName);
        if (entitySet) {
            const entityTypeDef = this.getEntityDefinition(entitySet);
            const defaultFieldPropName = 'Telerik.Sitefinity.V1.DefaultField';
            const propertiesPropName = 'properties';

            if (entityTypeDef.hasOwnProperty(defaultFieldPropName)) {
                return entityTypeDef[defaultFieldPropName];
            } else if (entityTypeDef.hasOwnProperty(propertiesPropName)) {
                const defaultFieldName = entityTypeDef[propertiesPropName][defaultFieldPropName];
                if (defaultFieldName) {
                    return defaultFieldName;
                }
            }
        }

        return 'Title';
    }

    public static getSetNameFromType(itemType: string)  {
        const definition = ServiceMetadata.serviceMetadataCache.definitions[itemType];
        if (definition != null) {
            const sets = ServiceMetadata.serviceMetadataCache.entityContainer.entitySets;
            const setName = Object.keys(sets).find((x) => {
                return sets[x]['entityType']['$ref'].endsWith(itemType);
            });

            return setName;
        }

        return itemType;
    }

    public static getModuleDisplayName(itemType: string): string {
        const definition = ServiceMetadata.serviceMetadataCache.definitions[itemType];
        if (definition) {
            const displayName = definition['properties']['Telerik.Sitefinity.V1.DisplayName'];
            return displayName;
        }

        return '';
    }

    public static getParentType(itemType: string) {
        const definition = ServiceMetadata.serviceMetadataCache.definitions[itemType];
        if (definition != null) {
            const parent = definition['properties']['Parent'];
            if (parent != null) {
                const anyOfProperty = parent['anyOf'] as Array<{ $ref: string }>;
                if (anyOfProperty != null && anyOfProperty.length > 0) {
                    let refProperty = anyOfProperty.find(x => x.$ref != null);
                    if (refProperty != null) {
                        return refProperty.$ref.replace('#/definitions/', '');
                    }
                }
            }
        }

        return null;
    }

    public static getChildTypes(itemType: string): Array<Array<string>> {
        const result: Array<Array<string>> = [];
        const definition = ServiceMetadata.serviceMetadataCache.definitions[itemType];
        if (definition != null) {
            const childTypes: Array<string> = definition['properties']['Telerik.Sitefinity.V1.ChildTypes'];
            if (childTypes != null) {
                result.push(childTypes);
                childTypes.forEach(childType => {
                    let grandChildTypes = this.getChildTypes(childType);
                    for (let i = 0; i < grandChildTypes.length; i++) {
                        let currentInheritanceLevel = result.at(i + 1);
                        if (currentInheritanceLevel != null) {
                            currentInheritanceLevel.push(...grandChildTypes[i]);
                        } else {
                            result.push(grandChildTypes[i]);
                        }

                    }
                });
            }
        }

        return result;
    }

    public static isPropertyACollection(type: string, propName: string) {
        let entityTypeDef = ServiceMetadata.serviceMetadataCache.definitions[type];
        let propMeta = entityTypeDef['properties'][propName];
        let propType = propMeta['type'];

        if (!propType) {
            return false;
        }

        if (Array.isArray(propType) || propType === 'array') {
            return true;
        }

        return false;
    }

    public static getRelatedType(type: string, relationName: string): string | null {
        const typeDefinition = ServiceMetadata.serviceMetadataCache.definitions[type];

        let properties = typeDefinition['properties'];
        let property = properties[relationName];
        if (typeof property !== 'object') {
            return null;
        }

        let relatedReferenceType = property['$ref'];
        if (relatedReferenceType == null) {
            let itemsProperty = property['items'];
            if (itemsProperty != null) {
                relatedReferenceType = itemsProperty['$ref'];
            }
        }

        if (relatedReferenceType == null) {
            let anyOfProperty: Array<any> = property['anyOf'];
            if (anyOfProperty && anyOfProperty.length > 0) {
                let relatedItemProperty = anyOfProperty.find(x => x['$ref'] != null);
                if (relatedItemProperty != null) {
                    relatedReferenceType = relatedItemProperty['$ref'];
                }
            }
        }

        if (relatedReferenceType == null) {
            return null;
        }

        const foundEntity = Object.values(this.serviceMetadataCache.entityContainer.entitySets).some(x => x['entityType']['$ref'] === relatedReferenceType);
        if (foundEntity) {
            return relatedReferenceType.replace('#/definitions/', '');
        }

        return null;
    }

    private static getEntityDefinition(itemType : string) {
        const mainEntitySet = ServiceMetadata.serviceMetadataCache.entityContainer.entitySets[itemType];

        if (!mainEntitySet) {
            throw new Error(`Could not find metadata for type ${itemType}`);
        }

        const entityTypeRef = mainEntitySet.entityType['$ref'];
        const entityTypeName = entityTypeRef.replace('#/definitions/', '');
        const entityTypeDef = ServiceMetadata.serviceMetadataCache.definitions[entityTypeName];

        return entityTypeDef;
    }

    private static isRelatedProperty(type: string, propName: string) {
        return !!this.getRelatedType(type, propName);
    }

    private static isPrimitiveProperty(type: string, propName: string) {
        const definition = ServiceMetadata.serviceMetadataCache.definitions[type];
        let properties = definition['properties'];
        let property = properties[propName];
        if (property == null) {
            throw new Error(`The field - ${propName} is not recognized as a property of the current type - ${type}`);
        }

        return (typeof property === 'object') && !this.isRelatedProperty(type, propName);
    }

    public static serializeFilterValue(type: string, propName: string, value: any) {
        const definition = ServiceMetadata.serviceMetadataCache.definitions[type];

        if (this.isPrimitiveProperty(type, propName)) {
            const propMeta = definition['properties'][propName];
            const propType = propMeta['type'];
            const propFormat = propMeta['format'];
            let propFormatToString = null;
            if (propFormat != null) {
                propFormatToString = propFormat.toString();
            }

            if (propType === null || propType === undefined) {
                return null;
            }

            const propTypeArray: string[] = propType;
            const propTypeString = propType.toString();

            if (value === null) {
                if (propTypeArray != null && propTypeArray.some(x => x === 'null')) {
                    return 'null';
                }

                return null;
            }

            if (propTypeString === 'array') {
                if (propMeta.items && propMeta.items.format) {
                    switch (propMeta.items.format) {
                        case 'string':
                            return `'${value}'`;
                        default:
                            return value.toString();
                    }
                }

                return null;
            } else if (propFormatToString === 'uuid') {
                return value.toString();
            } else if (propFormatToString === 'date-time') {
                if (value instanceof Date) {
                    return value.toISOString();
                } else if (Date.parse(value)) {
                    return new Date(Date.parse(value)).toISOString();
                }

                return null;
            } else if (propTypeString === 'boolean' && value instanceof Boolean) {
                return value.toString();
            } else if (propTypeArray != null && propType.length > 0) {
                if (propTypeArray.some(x => x.toString() === 'number') || propTypeArray.some(x => x.toString() === 'boolean')) {
                    return value.ToString();
                } else if (propTypeArray.some(x => x.toString() === 'string')) {
                    return `'${value}'`;
                }
            } else if (value != null) {
                return value.ToString();
            }
        }

        return null;
    }

    public static getSimpleFields(type: string): string[] {
        let definition = ServiceMetadata.serviceMetadataCache.definitions[type];
        let propertiesObject = definition['properties'];

        return <string[]>Object.keys(propertiesObject).map((key) => {
            if (this.isPrimitiveProperty(type, key)) {
                return key;
            }

            return null;
        }).filter(x => !!x);
    }

    public static getRelationFields(type: string): string[] {
        let definition = ServiceMetadata.serviceMetadataCache.definitions[type];
        let propertiesObject = definition['properties'];

        return <string[]>Object.keys(propertiesObject).map((key) => {
            if (this.isRelatedProperty(type, key)) {
                return key;
            }

            return null;
        }).filter(x => !!x);
    }

    public static getTaxonomyFieldName(type: string, taxonomyName: string) {
        let definition = ServiceMetadata.serviceMetadataCache.definitions[type];
        let propertiesObject = definition['properties'];
        return Object.keys(propertiesObject).find((key) => {
            const fieldMeta = propertiesObject[key];
            return fieldMeta['Telerik.Sitefinity.V1.Taxonomy'] === taxonomyName;
        });
    }

    public static getFieldType(type: string, propName: string) {
        const definition = ServiceMetadata.serviceMetadataCache.definitions[type];
        const propMeta = definition['properties'][propName];
        const fieldType = propMeta['Telerik.Sitefinity.V1.FieldType']?.toString();

        if (fieldType === 'ShortText' || fieldType === 'LongText') {
            return FieldType.TextField;
        } else if (fieldType === 'Choices' || fieldType === 'MultipleChoice') {
            return FieldType.ChoiceField;
        } else if (fieldType === 'Number') {
            return FieldType.NumberField;
        }

        const propFormat = propMeta['format']?.toString();
        if (propFormat === 'date-time') {
            return FieldType.DatetimeField;
        }

        const propType = propMeta['type'];
        if (propType) {
            const propTypeNumberArray = Array.isArray(propType);
            if (propTypeNumberArray) {
                const propAsArray = propType as string[];
                if (propAsArray.includes('number')) {
                    return FieldType.NumberField;
                } else if (propAsArray.includes('boolean')) {
                    return FieldType.BooleanField;
                } else if (propAsArray.includes('string')) {
                    return FieldType.TextField;
                }
            } else {
                if (propType === 'integer') {
                    return FieldType.NumberField;
                } else if (propType === 'boolean') {
                   return FieldType.BooleanField;
                } else if (propType === 'string') {
                    return FieldType.TextField;
                }
            }
        }

        let taxonomy = propMeta['Telerik.Sitefinity.V1.Taxonomy'];
        if (taxonomy && ServiceMetadata.taxonomies.find(x => x.Name === taxonomy)) {
            return FieldType.ClassificationField;
        }

        return FieldType.TextField;
    }
}

export interface ServiceMetadataDefinition {
    definitions: { [key: string]: any };
    entityContainer: {
        entitySets: { [key: string] : any }
    };
}

export enum FieldType {
    TextField,
    ChoiceField,
    NumberField,
    ClassificationField,
    DatetimeField,
    BooleanField
}
