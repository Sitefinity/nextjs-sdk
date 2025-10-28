import { WidgetMetadata } from './widget-metadata';
import { GetWidgetsArgs } from '../renderer-contract-interfaces';

/**
 * Widget filter function type that can filter widgets from the registry.
 * @param widgetMetadata The metadata of the widget to filter.
 * @param args The arguments from the getWidgets call containing toolbox, category, search criteria.
 * @returns Promise<boolean> True if the widget should be included in the results, false otherwise.
 */
export type WidgetFilter = (widgetMetadata: WidgetMetadata, args: GetWidgetsArgs) => Promise<boolean>;
