import { DetailItem } from '../../editor/detail-item';
import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { RedirectResponse } from './redirect.response';
import { PageScript } from './scripts';

export interface LayoutServiceResponse {
    Culture: string;
    SiteId: string;
    Id: string;
    ComponentContext: ComponentContext;
    MetaInfo: {
        Title: string,
        Description: string,
        HtmlInHeadTag: string,
        OpenGraphTitle: string,
        OpenGraphDescription: string,
        OpenGraphImage: string,
        OpenGraphVideo: string,
        OpenGraphType: string,
        OpenGraphSite: string,
        CanonicalUrl: string,
    },
    TemplateName?: string,
    DetailItem?: DetailItem,
    UrlParameters: string[],
    Scripts: PageScript[],
    Fields: { [key: string]: any },
    Site: any,
    MetadataHash: string
}

export interface LayoutResponse {
    isRedirect: boolean;
    redirect?: RedirectResponse;
    layout?: LayoutServiceResponse;
}

export interface ComponentContext {
    Components: WidgetModel[];
    HasLazyComponents: boolean;
}
