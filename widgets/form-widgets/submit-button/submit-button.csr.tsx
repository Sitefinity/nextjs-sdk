'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { SubmitButton } from './submit-button';
import { SubmitButtonEntity } from './submit-button.entity';

export function SubmitButtonCSR(props: WidgetContext<SubmitButtonEntity>) {
    return SubmitButton(props);
}
