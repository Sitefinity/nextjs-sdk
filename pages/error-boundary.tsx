'use client'; // Error boundaries must be Client Components

import React from 'react';
import { WidgetContext } from '../editor/widget-framework/widget-context';
import { WidgetExecutionError } from '../widgets/error/widget-execution-error-component';

export interface ErrorBoundaryCustomProps {
  children?: React.ReactNode,
  context: WidgetContext<any>
}

interface ErrorBoundaryHandlerState {
  error: Error | null
}

class ErrorBoundaryCustomHandler extends React.Component<
ErrorBoundaryCustomProps,
  ErrorBoundaryHandlerState
> {
  constructor(props: ErrorBoundaryCustomProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render(): React.ReactNode {
    if (this.state.error) {
      if (this.props.context.requestContext.isEdit) {
        const errorProps = {
          context: this.props.context,
          error: this.state.error.message + '\n' + this.state.error.stack
        };
        const element = React.createElement(WidgetExecutionError, errorProps);
        return (element);
      }

      if (((this.state.error as any)?.digest ?? (this.state.error as any)?.message)?.startsWith('NEXT_HTTP_ERROR_FALLBACK')) {
        throw this.state.error;
      }

      return (<></>);
    }

    return this.props.children;
  }
}

export function ErrorBoundaryCustom({
  children,
  context
}: ErrorBoundaryCustomProps) {
  return (
    <ErrorBoundaryCustomHandler
      context={context}
    >
      {children}
    </ErrorBoundaryCustomHandler>
  );
}
