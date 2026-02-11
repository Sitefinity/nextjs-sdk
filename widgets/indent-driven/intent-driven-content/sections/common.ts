export interface RenderSectionProps<T = any> {
    isLoading: boolean;
    sectionData?: T;
    cssClassName?: string;
}

export interface RelatedItemDto {
    id: string;
    providerName: string;
    title: string;
    url: string;
    type: string;
    params: Record<string, string>;
}

export interface ContentListItem {
    title: string;
    content: string;
    url: string;
    type: string;
    id: string;
    image?: RelatedItemDto;
}

export const modifySfUrl = (text?: string): string | undefined => {
    if (text && text.indexOf('localhost') !== -1) {
        text = text.replace(/(https?:\/\/)?localhost(:\d+)?/g, '');
    }
    return text;
};

