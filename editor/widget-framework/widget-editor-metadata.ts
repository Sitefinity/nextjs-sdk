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
    InitialProperties?: { [key: string]: string };
    WidgetBehavior?: WidgetBehavior;
}

export interface WidgetBehavior {
    NotPersonalizable?: boolean;
}
