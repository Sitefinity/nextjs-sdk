'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { DateTimeField } from './date-time-field';
import { DateTimeFieldEntity } from './date-time-field.entity';

export function DateTimeFieldCSR(props: WidgetContext<DateTimeFieldEntity>) {
	return DateTimeField(props);
}
