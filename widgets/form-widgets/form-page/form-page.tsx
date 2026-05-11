import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext, getMinimumWidgetContext } from '../../../editor/widget-framework/widget-context';
import { RenderView } from '../../common/render-view';
import { FormPageViewProps, FormPageChildComponent } from './form-page.view-props';
import { FormPageDefaultView } from './form-page.view';
import { FormPageEntity } from './form-page.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

const FormPagePlaceholder = 'formpage';

export function FormPage(props: WidgetContext<FormPageEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);

    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    dataAttributes['className'] = classNames('row', entity.CssClass);

    const children: FormPageChildComponent[] = [];
    if (props.model.Children) {
        props.model.Children
            .filter(x => x.PlaceHolder === FormPagePlaceholder)
            .forEach(x => {
                children.push({ model: x });
            });
    }

    const viewProps: FormPageViewProps<FormPageEntity> = {
        pageLabel: entity.PageLabel || 'Step',
        buttonLabel: entity.ButtonLabel || 'Next',
        allowStepBackward: entity.AllowStepBackward,
        backLinkLabel: entity.BackLinkLabel || 'Back',
        cssClass: entity.CssClass,
        isEdit: props.requestContext.isEdit,
        children: children,
        attributes: dataAttributes,
        widgetContext: getMinimumWidgetContext(props)
    };

    return (
      <RenderView
        viewName={entity.SfViewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <FormPageDefaultView {...viewProps} />
      </RenderView>
    );
}
