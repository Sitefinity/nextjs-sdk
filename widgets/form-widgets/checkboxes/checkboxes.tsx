import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { CheckboxesEntity } from './checkboxes.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { RenderView } from '../../common/render-view';
import { CheckboxesDefaultView } from './checkboxes.view';
import { CheckboxesViewProps } from './interfaces/checkboxes-view-model';

export function Checkboxes(props: WidgetContext<CheckboxesEntity>) {
    const { span } = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;
    const viewProps: CheckboxesViewProps<CheckboxesEntity> = {
      choices: entity.Choices || [],
      cssClass: entity.CssClass || '',
      hasAdditionalChoice: entity.HasAdditionalChoice,
      instructionalText: entity.InstructionalText || '',
      label: entity.Label || '',
      required: entity.Required,
      requiredErrorMessage: entity.RequiredErrorMessage,
      sfFieldName: entity.SfFieldName!,
      columnsNumber: entity.ColumnsNumber,
      attributes: {...htmlAttributes(props)},
      widgetContext: getMinimumWidgetContext(props)
  };

    return (
      <RenderView
        viewName={props.model.Properties.SfViewName || undefined}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <CheckboxesDefaultView {...viewProps} />
      </RenderView>
    );
}
