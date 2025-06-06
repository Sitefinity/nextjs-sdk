import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ListDisplayMode } from './list-display-mode';

@Model()
export class ContentListSettings {
    ItemsPerPage: number = 20;
    LimitItemsCount: number = 20;
    DisplayMode: ListDisplayMode = ListDisplayMode.Paging;
}
