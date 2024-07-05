import { SdkItem } from './sdk-item';

export interface PageItem extends SdkItem {
    ViewUrl: string;
    AvailableLanguages: string[];
    IsHomePage: boolean;
    UrlName: string;
    Renderer: string;
}
