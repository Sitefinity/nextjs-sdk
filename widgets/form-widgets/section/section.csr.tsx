'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { FormSectionEntity } from './section.entity';
import { FormSection } from './section';

export function FormSectionCSR(props: WidgetContext<FormSectionEntity>) {
    return FormSection(props);
}
