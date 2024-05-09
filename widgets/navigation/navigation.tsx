import React from 'react';

import { StyleGenerator } from '../styling/style-generator.service';
import { Horizontal } from './horizontal';
import { Accordion } from './accordion';
import { Vertical } from './vertical';
import { Tabs } from './tabs';
import { NavigationEntity } from './navigation.entity';
import { RestClient } from '../../rest-sdk/rest-client';
import { combineClassNames } from '../../editor/utils/classNames';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';


export async function Navigation(props: WidgetContext<NavigationEntity>) {
    const entity = props.model.Properties;
    const dataAttributes = htmlAttributes(props);
    const navItems = await RestClient.getNavigation({
        currentPage: props.requestContext.layout.Id,
        levelsToInclude: entity.LevelsToInclude,
        selectedPageId: entity.SelectedPage && entity.SelectedPage.ItemIdsOrdered && entity.SelectedPage.ItemIdsOrdered.length > 0 ? entity.SelectedPage.ItemIdsOrdered[0] : undefined,
        selectedPages: entity.CustomSelectedPages && entity.CustomSelectedPages.ItemIdsOrdered && entity.CustomSelectedPages.ItemIdsOrdered.length > 0 ? entity.CustomSelectedPages.ItemIdsOrdered : undefined,
        selectionMode: entity.SelectionMode,
        showParentPage: entity.ShowParentPage,
        culture: props.requestContext.culture
    }) || [];

    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);
    const navCustomAttributes = getCustomAttributes(entity.Attributes, 'SitefinityNavigation');

    dataAttributes['className'] = combineClassNames(marginClass, entity.WrapperCssClass);

    const viewName = props.model.Properties.SfViewName;
    return (
      <div {...dataAttributes}>
        { viewName === 'Accordion' && <Accordion items={navItems} {...navCustomAttributes}/>}
        { viewName === 'Horizontal' && <Horizontal items={navItems} {...navCustomAttributes}/>}
        { viewName === 'Tabs' && <Tabs items={navItems} {...navCustomAttributes}/>}
        { viewName === 'Vertical' && <Vertical items={navItems} {...navCustomAttributes}/>}
      </div>
    );
}
