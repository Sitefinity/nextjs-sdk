import { WidgetContext } from '../../editor/widget-framework/widget-context';

export abstract class Tracer {
    public static startTrace<F>(key: string, fn:(span: any | undefined) => F): F {
        return fn(undefined);
    }

    public static startSpan(key: string, createContext = false, currentContext?: any): { span: any | undefined, ctx?: any } {
       return { span: undefined, ctx: undefined };
    }

    public static traceWidget(widgetContext: WidgetContext<any>, createContext = false) {
        return this.startSpan(widgetContext.model.Name, createContext, widgetContext.traceContext);
    }

    public static endSpan(span?: any) {
        return null;
    }

    public static withContext<T>(fn: () => T, ctx?: any) {
        return fn();
    }

    public static logEvent(name: string, attributes?: any, span?: any) {
    }
}
