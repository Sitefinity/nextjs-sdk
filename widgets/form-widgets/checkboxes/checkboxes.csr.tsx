'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { CheckboxesEntity } from './checkboxes.entity';
import { Checkboxes } from './checkboxes';

export function CheckboxesCSR(props: WidgetContext<CheckboxesEntity>) {
    return Checkboxes(props);
}
