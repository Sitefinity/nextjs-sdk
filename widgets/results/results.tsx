import { ResultsEntity } from './results.entity';
import { FindResultItem, ResultsViewProps } from './results.view-props';
import { ResultsDefaultView } from './results.view';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { classNames } from '../../editor/utils/classNames';
import { StyleGenerator } from '../styling/style-generator.service';
import { RenderView } from '../common/render-view';
import { RootUrlService } from '../../rest-sdk/root-url.service';
import { RestClient } from '../../rest-sdk/rest-client';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

interface FindResponse {
    Resources: { [key: string]: Resource };
}

interface Resource {
    Fields: { [key: string]: Field };
    Thumbnail: string;
    Title: string;
    Origin: Origin;
}

interface Field {
    Paragraphs: { [key: string]: Paragraph };
}

interface Paragraph {
    Order: number;
    Text: string;
}

interface Origin {
    Url: string;
}

async function performFind(
    searchQuery: string,
    knowledgeBoxName: string,
    configurationName: string | undefined,
    traceContext?: any
): Promise<FindResultItem[]> {
    try {
        const url = `${RootUrlService.getServerCmsServiceUrl()}/AgenticRag/find`;
        const response = await RestClient.sendRequest<FindResponse>({
            url,
            method: 'POST',
            data: {
                KnowledgeBoxName: knowledgeBoxName,
                Query: searchQuery,
                ConfigurationName: configurationName,
                Show: [ 'basic', 'origin', 'values' ],
                Take: 200
            },
            traceContext
        });

        const resultItems: FindResultItem[] = [];

        for (const resourceKey of Object.keys(response.Resources)) {
            const resource = response.Resources[resourceKey];

            if (resource.Origin?.Url) {
                const allParagraphs: Paragraph[] = [];
                for (const fieldKey of Object.keys(resource.Fields)) {
                    const field = resource.Fields[fieldKey];
                    for (const paraKey of Object.keys(field.Paragraphs)) {
                        allParagraphs.push(field.Paragraphs[paraKey]);
                    }
                }

                allParagraphs.sort((a, b) => a.Order - b.Order);
                resultItems.push({ Title: resource.Title, Link: resource.Origin.Url, Order: allParagraphs[0]?.Order ?? 0 });
            }
        }

        resultItems.sort((a, b) => a.Order - b.Order);
        return resultItems;
    } catch {
        return [];
    }
}

export async function Results(props: WidgetContext<ResultsEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const requestContext = props.requestContext;
    let dataAttributes = htmlAttributes(props);
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Results');

    dataAttributes['className'] = classNames(entity.CssClass, marginClass);

    const searchQuery = requestContext.searchParams?.['searchQuery'];
    const knowledgeBoxName = requestContext.searchParams?.['knowledgeBoxName'];
    const searchConfigurationName = requestContext.searchParams?.['searchConfigurationName'];

    let searchResults: FindResultItem[] | null = null;
    let resultsHeader = entity.NoResultsHeader.replace('{0}', searchQuery || '');
    let totalCount = 0;

    if (searchQuery && knowledgeBoxName) {
        const items = await performFind(
            searchQuery,
            knowledgeBoxName,
            searchConfigurationName,
            ctx
        );

        searchResults = items;
        totalCount = items.length;

        if (totalCount > 0) {
            resultsHeader = entity.SearchResultsHeader.replace('{0}', searchQuery);
        }
    }

    const viewProps: ResultsViewProps<ResultsEntity> = {
        cssClass: entity.CssClass || undefined,
        searchResults,
        resultsHeader,
        totalCount,
        resultsNumberLabel: entity.ResultsNumberLabel,
        pageSize: entity.PageSize ?? 20,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <ResultsDefaultView {...viewProps} />
      </RenderView>
    );
}
