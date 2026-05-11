import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { RenderView } from '../../common/render-view';
import { FormNavigationViewProps } from './form-navigation.view-props';
import { FormNavigationDefaultView } from './form-navigation.view';
import { FormNavigationEntity } from './form-navigation.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export function FormNavigation(props: WidgetContext<FormNavigationEntity>) {
    const { span } = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    dataAttributes['className'] = classNames('mb-3', entity.CssClass);

    const viewProps: FormNavigationViewProps<FormNavigationEntity> = {
        navigationSteps: entity.NavigationSteps || [],
        cssClass: entity.CssClass,
        attributes: dataAttributes,
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <FormNavigationDefaultView {...viewProps} />
      </RenderView>
    );
}
