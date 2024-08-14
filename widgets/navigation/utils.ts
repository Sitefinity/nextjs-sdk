import { NavigationItem } from '../../rest-sdk/dto/navigation-item';

export const getClass = (node: NavigationItem): string | undefined => {
    if (node.IsCurrentlyOpened) {
        return 'active';
    }

    return;
};
