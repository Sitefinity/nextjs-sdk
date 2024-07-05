import { StyleGenerator } from '../styling/style-generator.service';
import { ClassificationEntity } from './classification-entity';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes, setHideEmptyVisual } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestClient } from '../../rest-sdk/rest-client';
import { TaxonDto } from '../../rest-sdk/dto/taxon-dto';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

const mapTaxonProperties = (taxon: TaxonDto, taxonomyName: string, viewUrl?: string, searchParams?: { [key: string]: string; }) => {
    const children: TaxonDto[] = [];

    taxon.SubTaxa.forEach((child: TaxonDto) => {
        child.SubTaxa = mapTaxonProperties(child, taxonomyName, viewUrl, searchParams);
        child.UrlName = getTaxaUrl(taxonomyName, child.UrlName, viewUrl, searchParams);
        children.push(child);
    });

    return children;
};

const getTaxaUrl = (taxonomyName: string, taxonUrl: string, viewUrl?: string, searchParams?: { [key: string]: string; }) => {
    if (viewUrl === null) {
        return '#';
    }

    let queryString = '';

    if (searchParams && Object.keys(searchParams).length) {
        const whitelistedQueryParams = ['sf_site', 'sfaction', 'sf_provider', 'sf_culture'];
        const filteredQueryCollection: { [key: string]: string; } = {};
        whitelistedQueryParams.forEach(param => {
            const searchParamValue = searchParams[param];
            if (searchParamValue) {
                filteredQueryCollection[param] = searchParamValue;
            }
        });
        const queryList = new URLSearchParams(filteredQueryCollection);
        queryString = queryList.toString();

        if (queryString) {
            queryString = `?${queryString}`;
        }
    }

    if (taxonUrl.startsWith('/')) {
        taxonUrl = taxonUrl.substring(1);
    }

    return `${viewUrl}/-in-${taxonomyName},${taxonUrl.replaceAll('/', ',')}` + queryString;
};

const getTaxa = (entity: ClassificationEntity, traceContext?: any): Promise<TaxonDto[] | null> => {
    const settings = entity.ClassificationSettings;
    if (settings && settings.selectedTaxonomyId) {
        let orderBy = entity.OrderBy || 'Title ASC';

        if (orderBy === 'Custom') {
            orderBy = entity.SortExpression || '';
        } else if (orderBy === 'Manually') {
            orderBy = 'Ordinal';
        }

        return RestClient.getTaxons({
            orderBy,
            contentType: settings.byContentType as string,
            selectionMode: settings.selectionMode,
            showEmpty: entity.ShowEmpty,
            taxaIds: settings.selectedTaxaIds || [],
            taxonomyId: settings.selectedTaxonomyId,
            traceContext
        });
    }

    return Promise.resolve(null);
};

export async function Classification(props: WidgetContext<ClassificationEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const model = props.model;
    const properties = model.Properties;
    if (props.requestContext.isEdit && !model.Caption && properties?.ClassificationSettings?.selectedTaxonomyId) {
        model.Caption = `Classification - ${properties.ClassificationSettings.selectedTaxonomyTitle}`;
    }

    const settings = properties.ClassificationSettings;
    const dataAttributes = htmlAttributes(props);
    const taxa = await getTaxa(model.Properties, ctx);
    const viewUrl = props.requestContext.layout.Fields ? props.requestContext.layout.Fields['ViewUrl'] : '';
    const searchParams = props.requestContext.searchParams;

    const updatedTokens = taxa ? taxa.map(taxon => {
        return {
            ...taxon,
            SubTaxa: mapTaxonProperties(taxon, settings!.selectedTaxonomyName!, viewUrl, searchParams),
            UrlName: getTaxaUrl(settings!.selectedTaxonomyName!, taxon.UrlName, viewUrl, searchParams)
        };
    }) : [];

    if (props.requestContext.isEdit && taxa) {
        setHideEmptyVisual(dataAttributes, true);
    }

    const showItemCount = properties.ShowItemCount;
    const defaultClass = properties.CssClass;
    const marginClass = properties.Margins && StyleGenerator.getMarginClasses(properties.Margins);
    const classificationCustomAttributes = getCustomAttributes(properties.Attributes, 'Classification');
    dataAttributes['className'] = classNames(defaultClass, marginClass);

    dataAttributes['data-sf-role'] = 'classification';

    const renderSubTaxa = (taxa: TaxonDto[], show: boolean) => {
        return (taxa && taxa.length > 0 ? <ul>
          {
                taxa.map((t: TaxonDto, idx: number) => {
                    const count = show ? `(${t.AppliedTo})` : '';
                    return (<li key={idx} className="list-unstyled">
                      <a className="text-decoration-none" href={t.UrlName}>{t.Title}</a>
                      { count }
                      { t.SubTaxa && renderSubTaxa(t.SubTaxa, show) }
                    </li>);
                })
            }
        </ul> : null
          );
    };

    return (
      <>
        <ul
          {...dataAttributes}
          {...classificationCustomAttributes}
        >
          {
                updatedTokens.map((item: TaxonDto, idx: number) => {
                    const count = showItemCount ? `(${item.AppliedTo})` : '';
                    return (<li key={idx} className="list-unstyled">
                      <a className="text-decoration-none" href={item.UrlName}>{item.Title}</a>
                      {count}
                      {
                          item.SubTaxa && renderSubTaxa(item.SubTaxa, showItemCount)
                        }
                    </li>);
                }
            )
        }
        </ul>
        { Tracer.endSpan(span) }
      </>
    );
}
