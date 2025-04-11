'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { ParagraphEntity } from './paragraph.entity';
import { Paragraph } from './paragraph';

export function ParagraphCSR(props: WidgetContext<ParagraphEntity>) {
    return Paragraph(props);
}
