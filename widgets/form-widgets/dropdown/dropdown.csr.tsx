'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { Dropdown } from './dropdown';
import { DropdownEntity } from './dropdown.entity';

export function DropdownCSR(props: WidgetContext<DropdownEntity>) {
    return Dropdown(props);
}
