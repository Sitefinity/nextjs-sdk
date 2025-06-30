'use client'; // Error components must be Client Components

import React from 'react';
import { WidgetContext } from '../editor/widget-framework/widget-context';
import { usePathname } from 'next/navigation';
import { WidgetExecutionError } from '../widgets/error/widget-execution-error-component';

export interface ErrorBoundaryCustomProps {
  children?: React.ReactNode,
  context: WidgetContext<any>
}

interface ErrorBoundaryHandlerCustomProps extends ErrorBoundaryCustomProps {
  pathname: string
}

interface ErrorBoundaryHandlerState {
  error: Error | null,
  previousPathname: string
}


class ErrorBoundaryCustomHandler extends React.Component<
ErrorBoundaryHandlerCustomProps,
  ErrorBoundaryHandlerState
> {
  constructor(props: ErrorBoundaryHandlerCustomProps) {
    super(props);
    this.state = { error: null, previousPathname: this.props.pathname };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryHandlerCustomProps,
    state: ErrorBoundaryHandlerState
  ): ErrorBoundaryHandlerState | null {
    /**
     * Handles reset of the error boundary when a navigation happens.
     * Ensures the error boundary does not stay enabled when navigating to a new page.
     * Approach of setState in render is safe as it checks the previous pathname and then overrides
     * it as outlined in https://react.dev/reference/react/useState#storing-information-from-previous-renders
     */
    if (props.pathname !== state.previousPathname && state.error) {
      return {
        error: null,
        previousPathname: props.pathname
      };
    }
    return {
      error: state.error,
      previousPathname: props.pathname
    };
  }

  reset = () => {
    this.setState({ error: null });
  };

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

      return (<></>);
    }

    return this.props.children;
  }
}

export function ErrorBoundaryCustom({
  children,
  context
}: ErrorBoundaryCustomProps) {
  const pathname = usePathname();
  return (
    <ErrorBoundaryCustomHandler
      context={context}
      pathname={pathname}
    >
      {children}
    </ErrorBoundaryCustomHandler>
  );
}
