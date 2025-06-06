import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Required } from '@progress/sitefinity-widget-designers-sdk/decorators/validations';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';

export interface ChoiceOption {
    Name: string;
    Value?: string;
    Selected?: boolean;
}

@Model()
export class ChoiceOptionModel {
    @Placeholder('add label')
    @DisplayName('Label')
    @Required()
    Name: string | null = null;


    @Placeholder('add value')
    Value?: string | null = null;

    Selected?: boolean;
}
