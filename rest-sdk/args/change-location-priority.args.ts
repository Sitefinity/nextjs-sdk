import { ItemArgs } from './item.args';

export interface ChangeLocationPriorityArgs extends ItemArgs {
    id: string;
    direction?: MovingDirection;
}

export enum MovingDirection {
    Bottom,
    Down,
    Up,
    Top
}
