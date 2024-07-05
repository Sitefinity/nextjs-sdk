import { htmlAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';

export function WidgetExecutionError(props: { error: string, context: WidgetContext<any>}) {
    const dataAttributes = htmlAttributes(props.context, props.error);

    return (
      <div {...dataAttributes as any} />
    );
}

