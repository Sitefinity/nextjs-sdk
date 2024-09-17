import { DetailItem } from '../../editor/detail-item';
import { WidgetModel } from '../../editor/widget-framework/widget-model';
import { RedirectResponse } from './redirect.response';
import { PageScript } from './scripts';

export interface PartialLayoutServiceResponse {
    Culture: string;
    SiteId: string;
    Id: string;
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
    UrlParameters: string[],
    Fields: { [key: string]: any },
    Site: any
}

export interface LayoutServiceResponse extends PartialLayoutServiceResponse {
    ComponentContext: ComponentContext,
    DetailItem?: DetailItem,
    Scripts: PageScript[],
    TemplateName?: string,
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
