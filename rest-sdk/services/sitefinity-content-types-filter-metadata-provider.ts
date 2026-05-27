import { FilterClause } from '../filters/filter-clause';
import { FieldType, ServiceMetadata } from '../service-metadata';
import { IFilterMetadataProvider } from './filter-metadata-provider';
import { FilterContext } from './odata-filter-serializer';

export class SitefinityContentTypesFilterMetadataProvider implements IFilterMetadataProvider {
    getFieldType(clause: FilterClause, filterContext: FilterContext): FieldType {
        return ServiceMetadata.getFieldType(filterContext.Type, clause.FieldName);
    }

    getRelatedType(filterName: string, filterContext: FilterContext): string | null {
        return ServiceMetadata.getRelatedType(filterContext.Type, filterName);
    }

    isPropertyACollection(filterContext: FilterContext, clause: FilterClause): boolean {
        return ServiceMetadata.isPropertyACollection(filterContext.Type, clause.FieldName);
    }

    trySerializeFilterValue(propName: string, value: any, filterContext: FilterContext): { success: boolean, result: string | null } {
        const serialized = ServiceMetadata.serializeFilterValue(filterContext.Type, propName, value);
        if (serialized === null || serialized === undefined) {
            return { success: false, result: null };
        }

        return { success: true, result: serialized };
    }
}
