import { Attributes, Context, Span, context, trace } from '@opentelemetry/api';
import { Tracer as InternalTracer} from '../empty/diagnostics-tracer-empty';
import { WidgetContext } from '../../editor/widget-framework/widget-context';

export class Tracer extends InternalTracer {
    public static startTrace<F>(key: string, fn:(span: Span) => F): F {
        const tracer = trace.getTracer('next-app');

        return tracer.startActiveSpan(key, (span: Span) => {
            return fn(span);
        });
    }

    public static startSpan(key: string, createContext = false, currentContext?: Context): { span: Span, ctx?: Context } {
        const tracer = trace.getTracer('next-app');

        let ctx;
        const span = tracer.startSpan(`SF ${key}`, undefined, currentContext);
        if (createContext) {
            ctx = trace.setSpan(context.active(), span);
        } else {
            ctx = context.active();
        }

        return { span, ctx };
    }

    public static traceWidget(widgetContext: WidgetContext<any>, createContext = false) {
        return this.startSpan(`Render widget: ${widgetContext.model.Caption || widgetContext.model.Name}`, createContext, widgetContext.traceContext);
    }

    public static endSpan(span?: Span) {
        span?.end();
        return null;
    }

    public static withContext<T>(fn: () => T, ctx?: Context) {
        if (ctx) {
            return context.with(ctx, fn);
        }

        return fn();
    }

    public static logEvent(name: string, attributes?: Attributes, span?: Span) {
        const activeSpan = span || trace.getActiveSpan();
        activeSpan?.addEvent(name, attributes);
    }
}
