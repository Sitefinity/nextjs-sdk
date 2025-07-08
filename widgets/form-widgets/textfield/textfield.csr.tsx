'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { TextFieldEntity } from './text-field.entity';
import { TextField } from './textfield';

export function TextFieldCSR(props: WidgetContext<TextFieldEntity>) {
    return TextField(props);
}
