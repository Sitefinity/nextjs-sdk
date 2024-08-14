import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { Dictionary } from '../../../typings/dictionary';
import { RenderView } from '../../common/render-view';
import { SubmitButtonViewProps } from './interfaces/submit-button.view-props';
import { SubmitButtonDefaultView } from './submit-button.view';
import { SubmitButtonEntity } from './submit-button.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export function SubmitButton(props: WidgetContext<SubmitButtonEntity>) {
    const { span } = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    dataAttributes['className'] = classNames('mb-3', entity.CssClass);
    const widgetProps: Dictionary = {
        ['data-sf-role']: 'submit-button-container'
    };

    const viewProps: SubmitButtonViewProps<SubmitButtonEntity> = {
      label: entity.Label || '',
      attributes: {...dataAttributes, ...widgetProps},
      widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <SubmitButtonDefaultView {...viewProps}/>
      </RenderView>
    );
}
