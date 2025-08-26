/**
 * WidgetModel interface represents the persisted widget's data.
 */
export interface WidgetModel<T extends {[key: string]: any} = {[key: string]: any}> {
    /**
     * The widget's unique identifier.
     */
    Id: string;

    /**
     * The widget's type name.
     */
    Name: string;

    /**
     * The widget's caption for the editor if defiend.
     */
    Caption: string;

    /**
     * Whether the widget should be rendered after the page is loaded.
     * This is used for lazy loading of widgets, personalized widgets, etc.
     * If true, the widget should be rendered after the page is loaded.
     */
    Lazy: boolean;

    /**
     * Whether the widget is orphaned.
     * An orphaned widget has the value of its Placeholder property set to a non-existing placeholder on the current page.
     * This can happen when the placeholder is removed but the widget is not for some reason.
     */
    Orphaned: boolean;

    /**
     * The name of the widget's parent widget.
     * This is used for widgets that are children of layout components, template placeholders, etc.
     */
    PlaceHolder: string;

    /**
     * The widget's properties.
     * This represents the widget's persisted data.
     * The properties are defined by the widget's entity and are used to configure the widget's behavior and appearance.

     */
    Properties: T;

    /**
     * The widget's child widgets if any.
     * This is used for widgets that can contain other widgets, such as layout components, sections, etc.
     */
    Children: WidgetModel[];
}
