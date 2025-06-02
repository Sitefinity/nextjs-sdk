import { ChoiceItem } from '@progress/sitefinity-widget-designers-sdk';

export enum FieldSize {
    None='None',
    Small='S',
    Medium='M',
    Large='L',
}

export const FIELD_SIZE_OPTIONS: ChoiceItem[] = [
    { Value: FieldSize.None, Title: 'None' },
    { Value: FieldSize.Small, Title: 'Small' },
    { Value: FieldSize.Medium, Title: 'Medium' },
    { Value: FieldSize.Large, Title: 'Large' }
];
