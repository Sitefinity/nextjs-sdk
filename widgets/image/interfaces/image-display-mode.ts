import { ChoiceItem } from '@progress/sitefinity-widget-designers-sdk/common';

export enum ImageDisplayMode {
    Responsive = 'Responsive',
    OriginalSize = 'OriginalSize',
    Thumbnail = 'Thumbnail',
    CustomSize = 'CustomSize',
}

export const ImageDisplayChoices: ChoiceItem[] = [
    { Value: 'Responsive'},
    { Value: 'OriginalSize', Title: 'Original size'},
    { Value: 'Thumbnail', Title: 'Use thumbnail'},
    { Value: 'CustomSize', Title: 'Custom size'}
];
