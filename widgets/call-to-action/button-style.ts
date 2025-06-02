import { Choice, DefaultValue, DisplayName, Model } from '@progress/sitefinity-widget-designers-sdk';

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
