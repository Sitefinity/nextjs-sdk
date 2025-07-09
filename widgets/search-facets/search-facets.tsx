import { StyleGenerator } from '../styling/style-generator.service';
import { SearchFacetsEntity } from './search-facets.entity';
import { classNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { SearchFacetsViewProps } from './search-facets.view-props';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../common/render-view';
import { SearchFacetsDefaultView } from './search-facets.view';

export async function SearchFacets(props: WidgetContext<SearchFacetsEntity>) {
    const {span, ctx} = Tracer.traceWidget(props, true);
    const model = props.model;
    const entity = model.Properties;
    const dataAttributes = htmlAttributes(props);
    const defaultClass =  entity.WidgetCssClass;
    const marginClass = entity.Margins! && StyleGenerator.getMarginClasses(entity.Margins!);
    const customAttributes = getCustomAttributes(entity.Attributes, 'SearchFacets');

    dataAttributes['className'] = classNames(
        defaultClass,
        marginClass
    );

    const viewProps: SearchFacetsViewProps<SearchFacetsEntity> = {
        indexCatalogue: entity.IndexCatalogue,
        appliedFiltersLabel: entity.AppliedFiltersLabel,
        clearAllLabel: entity.ClearAllLabel,
        filterResultsLabel: entity.FilterResultsLabel,
        showMoreLabel: entity.ShowMoreLabel,
        showLessLabel: entity.ShowLessLabel,
        isShowMoreLessButtonActive: entity.IsShowMoreLessButtonActive,
        displayItemCount: entity.DisplayItemCount,
        isEdit: props.requestContext.isEdit,
        webserviceApiKey: props.requestContext.webserviceApiKey,
        attributes: {...dataAttributes, ...customAttributes},
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <SearchFacetsDefaultView {...viewProps}/>
      </RenderView>
    );
}
