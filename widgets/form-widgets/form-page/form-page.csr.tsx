'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { FormPage } from './form-page';
import { FormPageEntity } from './form-page.entity';

export function FormPageCSR(props: WidgetContext<FormPageEntity>) {
    return FormPage(props);
}
