'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { MultipleChoice } from './multiple-choice';
import { MultipleChoiceEntity } from './multiple-choice.entity';

export function MultipleChoiceCSR(props: WidgetContext<MultipleChoiceEntity>) {
    return MultipleChoice(props);
}
