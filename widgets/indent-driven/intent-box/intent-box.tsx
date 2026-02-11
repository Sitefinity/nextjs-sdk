import { getMinimumWidgetContext, WidgetContext } from '../../../editor/widget-framework/widget-context';
import { AfterIntentAction, IntentBoxEntity } from './intent-box.entity';
import { RenderView } from '../../common/render-view';
import { IntentBoxDefaultView, IntentBoxViewProps } from './intent-box-default.view';
import { RestClientForContext } from '../../../services/rest-client-for-context';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export async function IntentBox(props: WidgetContext<IntentBoxEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const model = props.model.Properties;
    const attr = htmlAttributes(props);

    const labelText = model.Label;
    const placeholder = model.PlaceholderText || '';
    const submitButtonTooltip = model.SubmitButtonTooltip;
    const containerCss = model.CssClass || '';

    let pageUrl = '';

    try {
        if (model.AfterIntentIsSubmitted === AfterIntentAction.Redirect && model.TargetPage) {
            pageUrl = (await RestClientForContext.getItem(model.TargetPage, {traceContext: ctx}))?.ViewUrl;
        }
    } catch (error) {
        console.log('Error fetching page URL:', error);
    }

    const inputId = `input_${Math.random().toString(36).substring(2, 11)}`;

    const viewProps: IntentBoxViewProps = {
        widgetContext: getMinimumWidgetContext(props),
        attributes: attr,
        labelText: labelText || '',
        placeholder: placeholder || '',
        submitButtonTooltip: submitButtonTooltip || '',
        containerCss: containerCss,
        pageUrl: pageUrl,
        inputId: inputId,
        suggestions: model.Suggestions || [],
        suggestionsLabel: model.SuggestionsLabel || ''
    };

    return (
      <RenderView
        traceSpan={span}
        viewName={model.SfViewName}
        viewProps={viewProps}
        widgetKey={props.model.Name}>
        <IntentBoxDefaultView {...viewProps} />
      </RenderView>
    );
}
