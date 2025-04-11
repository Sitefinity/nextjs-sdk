import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { Model } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';


@Model()
export class ButtonStyle {
    @DisplayName('Display style for')
    @DefaultValue('Primary')
    @Choice([
        { Value: 'Primary', Name: 'Primary action' },
        { Value: 'Secondary', Name: 'Secondary action' },
        { Value: 'Link', Icon: null }
    ])
    DisplayStyle: 'Primary' | 'Secondary' | 'Link' = 'Primary';
}
