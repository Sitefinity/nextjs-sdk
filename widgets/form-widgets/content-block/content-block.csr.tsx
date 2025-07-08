'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { FormContentBlock } from './content-block';
import { FormContentBlockEntity } from './content-block.entity';

export function FormContentBlockCSR(props: WidgetContext<FormContentBlockEntity>) {
    return FormContentBlock(props);
}
