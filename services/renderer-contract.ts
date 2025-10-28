'use client';

import { RenderWidgetService } from './render-widget-service';
import { ComponentMetadata, GetCategoriesArgs, GetWidgetMetadataArgs, GetWidgetsArgs, RenderResult, RenderWidgetArgs, RendererContract, TotalCountResult, WidgetItem, WidgetSection } from '../editor/renderer-contract-interfaces';
import { RequestContext } from '../editor/request-context';
import { WidgetMetadata } from '../editor/widget-framework/widget-metadata';
import { createRoot } from 'react-dom/client';
import { MetadataModel } from '@progress/sitefinity-widget-designers-sdk/metadata';
import { RestClient } from '../rest-sdk/rest-client';
import { LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';

export class RendererContractImpl implements RendererContract {

    getWidgetMetadata(args: GetWidgetMetadataArgs): Promise<ComponentMetadata> {
        const widgetRegister = RenderWidgetService.widgetRegistry.widgets[args.widgetName];
        const designerMetadata = widgetRegister?.designerMetadata ||
            <MetadataModel>{Name: args.widgetName, Caption: args.widgetName, PropertyMetadata: [], PropertyMetadataFlat: []};
        return Promise.resolve(designerMetadata);
    }

    // html string to change the widget and rerender it
    renderWidget(args: RenderWidgetArgs): Promise<RenderResult> {
        const widgetMetadata = RenderWidgetService.widgetRegistry.widgets[args.model.Name];

        if (widgetMetadata.ssr) {
            return new Promise((resolve, reject) => {
                fetch(`/render?sfaction=edit&sf_culture=${args.dataItem.culture}&sf_site=${args.siteId}&widgetSegmentId=${args.widgetSegmentId}&itemId=${args.dataItem.key}&widgetId=${args.model.Id}&itemType=${(args.dataItem as any).metadata.typeFullName}&pageUrl=${encodeURIComponent((args.dataItem as any).data['EditUrl'])}&segment=${args.segmentId}`).then((response) => {
                    response.text().then((html) => {
                        let rootDoc = document.createElement('html');
                        rootDoc.innerHTML = html;
                        const wrapper = rootDoc.querySelector('div[id=\'widgetPlaceholder\']');
                        if (wrapper) {
                            resolve(<RenderResult>{
                                element: wrapper.firstElementChild as HTMLElement,
                                content: '',
                                scripts: []
                            });
                        } else {
                            reject('Wrapping widgetplaceholder not found');
                        }
                    });
                });
            });
        }

        return new Promise((resolve) => {
            const tempElement = document.createElement('div');
            const context: RequestContext = {
                isEdit: true,
                layout: <LayoutServiceResponse> {
                    SiteId: args.siteId,
                    Culture: args.dataItem.culture
                },// TODO
                isPreview: false,
                isLive: false,
                culture: args.dataItem.culture,
                searchParams: {},
                url: '',
                pageNode: <any>undefined
            };

            RestClient.contextQueryParams = {
                sf_culture: args.dataItem.culture,
                sf_site: args.siteId
            };

            const component = RenderWidgetService.createComponent(args.model, context);

            createRoot(tempElement).render(component);
            setTimeout(() => {
                resolve({
                    element: tempElement.firstElementChild as HTMLElement,
                    content: '',
                    scripts: []
                });
            }, 500);
        });
    }

    async getWidgets(args: GetWidgetsArgs): Promise<TotalCountResult<WidgetSection[]>> {
        const filteredWidgetsByToolBox: WidgetMetadata[] = [];

        Object.keys(RenderWidgetService.widgetRegistry.widgets).forEach((key) => {
            const widgetEntry = RenderWidgetService.widgetRegistry.widgets[key];
            widgetEntry.editorMetadata = widgetEntry.editorMetadata || {};
            widgetEntry.editorMetadata.Name = widgetEntry.editorMetadata?.Name || key;

            if (args.toolbox) {
                if (widgetEntry.editorMetadata?.Toolbox === args.toolbox) {
                    filteredWidgetsByToolBox.push(widgetEntry);
                }

                return;
            }

            if (widgetEntry.editorMetadata?.Toolbox) {
                return;
            }

            filteredWidgetsByToolBox.push(widgetEntry);
        });

        let filteredWidgetsByCategory: WidgetMetadata[] = [];
        filteredWidgetsByToolBox.forEach((widgetEntry) => {

            if (args.category) {
                let widgetCategory = widgetEntry.editorMetadata?.Category || 'Content';
                if (widgetCategory.toUpperCase().indexOf(args.category.toUpperCase()) !== -1) {
                    filteredWidgetsByCategory.push(widgetEntry);
                }

                return;
            }

            filteredWidgetsByCategory.push(widgetEntry);
        });

        let filteredWidgetsBySearch: WidgetMetadata[] = [];
        filteredWidgetsByCategory.forEach((widgetEntry) => {

            if (args.search) {
                if ((widgetEntry.editorMetadata?.Title || widgetEntry.editorMetadata?.Name)?.toUpperCase()?.indexOf(args.search.toUpperCase()) !== -1) {
                    filteredWidgetsBySearch.push(widgetEntry);
                }

                return;
            }

            filteredWidgetsBySearch.push(widgetEntry);
        });
        
        const filteredWidgetsByFilterRegistry = await this.applyRegistryFiltersAsync(filteredWidgetsBySearch, args);

        const widgetsBySection: { [key: string]: WidgetMetadata[] } = {};
        filteredWidgetsByFilterRegistry.forEach((widget) => {
            const sectionName = widget.editorMetadata?.Section || '';
            const widgetSectionArray = widgetsBySection[sectionName] || [];
            widgetSectionArray.push(widget);

            widgetsBySection[sectionName] = widgetSectionArray;
        });

        let widgetCount = 0;
        const widgetSections = Object.keys(widgetsBySection).map((x) => {
            return <WidgetSection>{
                title: x,
                widgets: widgetsBySection[x].map(y => {
                    widgetCount++;
                    let initialProperties: Array<{ name: string, value: string }> = [];
                    if (y.editorMetadata && y.editorMetadata.InitialProperties) {
                        Object.keys(y.editorMetadata.InitialProperties).map((propName) => {
                            initialProperties.push({
                                name: propName,
                                value: ((y.editorMetadata as any).InitialProperties as any)[propName]
                            });
                        });
                    }

                    return <WidgetItem>{
                        name: y.editorMetadata?.Name || y.editorMetadata?.Title,
                        title: y.editorMetadata?.Title,
                        thumbnailUrl: y.editorMetadata?.ThumbnailUrl,
                        iconName: y.editorMetadata?.IconName,
                        iconUrl: y.editorMetadata?.IconUrl,
                        initialProperties: initialProperties,
                        widgetBehavior: y.editorMetadata?.WidgetBehavior,
                        isEmptyEntity: y.editorMetadata?.IsEmptyEntity
                    };
                })
            };
        });

        return Promise.resolve({
            totalCount: widgetCount,
            dataItems: widgetSections
        });
    }

    getCategories(args: GetCategoriesArgs): Promise<Array<string>> {
        // identify whether we are using the legacy widget registry
        let isLegacy = false;
        if (RenderWidgetService.widgetRegistry.widgets['SitefinitySection']?.editorMetadata?.Category === 'Layout & Presets') {
            isLegacy = true;
        }

        if (isLegacy) {
            if (args.toolbox === 'Forms') {
                return Promise.resolve(['Content', 'Layout & Presets']);
            }

            return Promise.resolve(['Content', 'Navigation & Search', 'Login & Users', 'Layout & Presets']);
        } else {
            return Promise.resolve(['Content', 'Layout']);
        }
    }

    /**
     * Applies all registered widget filters to the provided widgets collection.
     * @param widgets The widgets to filter
     * @param args The GetWidgetsArgs containing toolbox, category, search criteria
     * @returns Promise<WidgetMetadata[]> Filtered widgets that passed all filters
     */
    private async applyRegistryFiltersAsync(widgets: WidgetMetadata[], args: GetWidgetsArgs): Promise<WidgetMetadata[]> {
        const filteredWidgets: WidgetMetadata[] = [];
        
        // Apply all registered widget filters
        for (const widgetEntry of widgets) {
            let shouldIncludeWidget = true;
            
            // Check all registered filters
            if (RenderWidgetService.widgetRegistry.filters) {
                for (const filterFunction of RenderWidgetService.widgetRegistry.filters) {
                    // Call the filter function directly
                    const filterResult = await filterFunction(widgetEntry, args);
                    if (!filterResult) {
                        shouldIncludeWidget = false;
                        break; // If any filter excludes the widget, skip it
                    }
                }
            }
            
            if (shouldIncludeWidget) {
                filteredWidgets.push(widgetEntry);
            }
        }

        return filteredWidgets;
    }
}
