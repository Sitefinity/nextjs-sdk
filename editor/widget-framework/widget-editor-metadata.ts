export interface EditorMetadata {
    Title?: string;
    Name?: string;
    EmptyIconText?: string;
    EmptyIconAction?: 'Edit' | 'None';
    EmptyIcon?: string;
    /** @deprecated Not used with the new look for widget selector introduced with Sitefinity 15.1 */
    ThumbnailUrl?: string;
    IconName?: string;
    IconUrl?: string;
    Category?: 'Content' | 'Layout' | 'Layout & Presets' | 'Navigation & Search' | 'Login & Users';
    Section?: string;
    Toolbox?: string;
    Warning?: string;
    HideEmptyVisual?: boolean;
    HasQuickEditOperation?: boolean;
    Order?: number;
    IsEmptyEntity?: boolean;
    InitialProperties?: { [key: string]: string };
    WidgetBehavior?: WidgetBehavior;
}

export interface WidgetBehavior {
    /**
     * Defines that widget is not personalizable. Custom widgets can be personalized by default.
     */
    NotPersonalizable?: boolean;

    /**
     * Defines that the widget conatins items that are to be tracked in content locations.
     * For more information refer to: https://www.progress.com/documentation/sitefinity-cms/configure-custom-widgets-to-support-content-locations 
     */
    IsContentLocation?: boolean;
}
