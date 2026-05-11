'use client';

import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { FormNavigation } from './form-navigation';
import { FormNavigationEntity } from './form-navigation.entity';

export function FormNavigationCSR(props: WidgetContext<FormNavigationEntity>) {
    return FormNavigation(props);
}
