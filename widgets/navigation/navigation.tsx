import { StyleGenerator } from '../styling/style-generator.service';
import { Horizontal } from './horizontal';
import { Accordion } from './accordion';
import { Vertical } from './vertical';
import { Tabs } from './tabs';
import { NavigationEntity } from './navigation.entity';
import { RestClient } from '../../rest-sdk/rest-client';
import { combineClassNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../editor/widget-framework/widget-context';
import { RenderView } from '../common/render-view';
import { NavigationViewProps } from './navigation.view-props';

import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function Navigation(props: WidgetContext<NavigationEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    const dataAttributes = htmlAttributes(props);
    const navItems = await RestClient.getNavigation({
        currentPage: props.requestContext.layout.Id,
        levelsToInclude: entity.LevelsToInclude,
        selectedPageId: entity.SelectedPage && entity.SelectedPage.ItemIdsOrdered && entity.SelectedPage.ItemIdsOrdered.length > 0 ? entity.SelectedPage.ItemIdsOrdered[0] : undefined,
        selectedPages: entity.CustomSelectedPages && entity.CustomSelectedPages.ItemIdsOrdered && entity.CustomSelectedPages.ItemIdsOrdered.length > 0 ? entity.CustomSelectedPages.ItemIdsOrdered : undefined,
        selectionMode: entity.SelectionMode,
        showParentPage: entity.ShowParentPage,
        culture: props.requestContext.culture,
        traceContext: ctx
    }) || [];

    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const customAttributes = getCustomAttributes(entity.Attributes, 'SitefinityNavigation');

    dataAttributes['className'] = combineClassNames(marginClass, entity.WrapperCssClass);
    const viewName = props.model.Properties.SfViewName;
    const viewProps: NavigationViewProps<NavigationEntity> = { navCustomAttributes: customAttributes, items: navItems, attributes: dataAttributes, widgetContext: getMinimumWidgetContext(props) };
    return (
      <RenderView
        viewName={viewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        { viewName === 'Accordion' && <Accordion {...viewProps} />}
        { viewName === 'Horizontal' && <Horizontal {...viewProps} />}
        { viewName === 'Tabs' && <Tabs {...viewProps} />}
        { viewName === 'Vertical' && <Vertical {...viewProps} />}
      </RenderView>
    );
}
