import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { getMinimumMetadata } from '../../../editor/widget-framework/widget-metadata';
import { RenderWidgetService } from '../../../services/render-widget-service';
import { FormSectionEntity } from './section.entity';
import { FormSectionColumnHolder, FormSectionComponentContainer } from './section.view-props';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

const ColumnNamePrefix = 'Column';

export function FormSection(props: WidgetContext<FormSectionEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    props.model.Properties.ColumnProportionsInfo = props.model.Properties.ColumnProportionsInfo || ['12'];

    const columns = populateColumns(props);
    const dataAttributes = htmlAttributes(props);

    return (
      <>
        <section className="row" {...dataAttributes}>
          {columns.map((x, i) => {
          return (
            <div key={i} {...x.attributes}>
              {x.children.map(y => {
                    return RenderWidgetService.createComponent(y.model, props.requestContext, ctx);
                })}
            </div>
          );
        })}
        </section>
        { Tracer.endSpan(span) }
      </>
    );
}

function populateColumns(context: WidgetContext<FormSectionEntity>): FormSectionColumnHolder[] {
    const columns: FormSectionColumnHolder[] = [];
    const properties = context.model.Properties;

    for (let i = 0; i < properties.ColumnsCount; i++) {
        const currentName = `${ColumnNamePrefix}${i + 1}`;

        let children: Array<FormSectionComponentContainer> = [];
        if (context.model.Children) {
            children = context.model.Children.filter(x => x.PlaceHolder === currentName).map((x => {
                const ret: WidgetContext<any> = {
                    model: x,
                    metadata: getMinimumMetadata(RenderWidgetService.widgetRegistry.widgets[x.Name]),
                    requestContext: context.requestContext
                };

                return ret;
            }));
        }

        const column: FormSectionColumnHolder = {
            attributes: {
                className: `col-md-${properties.ColumnProportionsInfo![i]}`
            },
            children: children
        };

        if (context.requestContext.isEdit) {
            column.attributes['data-sfcontainer'] = currentName;
            column.attributes['data-sfplaceholderlabel'] = currentName!;
        }

        columns.push(column);
    }

    return columns;
}
