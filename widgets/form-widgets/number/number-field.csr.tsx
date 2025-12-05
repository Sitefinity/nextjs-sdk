'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { NumberField } from './number-field';
import { NumberFieldEntity } from './number-field.entity';

export function NumberFieldCSR(props: WidgetContext<NumberFieldEntity>) {
	return NumberField(props);
}
