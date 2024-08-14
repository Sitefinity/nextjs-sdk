import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { RenderView } from '../../common/render-view';
import { MultipleChoiceViewProps } from './interfaces/multiple-choice.view-props';
import { MultipleChoiceDefaultView } from './multiple-choice.view';
import { MultipleChoiceEntity } from './multiple-choice.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export function MultipleChoice(props: WidgetContext<MultipleChoiceEntity>) {
    const { span } = Tracer.traceWidget(props, false);
    const entity = props.model.Properties;
    const viewProps: MultipleChoiceViewProps<MultipleChoiceEntity> = {
        choices: entity.Choices || [],
        cssClass: entity.CssClass || '',
        hasAdditionalChoice: entity.HasAdditionalChoice,
        instructionalText: entity.InstructionalText || '',
        label: entity.Label || '',
        required: entity.Required,
        requiredErrorMessage: entity.RequiredErrorMessage,
        sfFieldName: entity.SfFieldName!,
        attributes: {...htmlAttributes(props)},
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName!}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <MultipleChoiceDefaultView {...viewProps}/>
      </RenderView>
    );
}
