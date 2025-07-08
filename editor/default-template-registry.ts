import { JSX, ReactNode } from 'react';
import { RequestContext } from './request-context';

export interface TemplateRegistry {
    [key: string]: { title: string, templateFunction?: (({ widgets, requestContext }: { widgets: {[key: string]: ReactNode [] }; requestContext: RequestContext; }) => JSX.Element) }
}

export const defaultTemplateRegistry: TemplateRegistry = {
    'Default': {
        title: 'Default'
    }
};
