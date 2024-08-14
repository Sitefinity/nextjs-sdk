'use client';

import { useCallback, useEffect, useState } from 'react';
import { WidgetModel } from '../editor/widget-framework/widget-model';


export const EVENTS = {
    PERSONALIZED_WIDGETS_LOADED: 'widgetPersnalizationLoaded'
};

export interface PersonalizedWidgetsPayload {
    [key: string]: {
        ssr: boolean,
        data: WidgetModel | string
    }
}

/**
 * Returns a stateful event payload value and a function to dispatch an event with data.
 * @param eventKey The custom event key to be dispatched and listened to.
 * @param attach Whether to create an event listener in the current hook instance or skip it.
 */
export function useSfEvents<T>(eventKey: string, attach = true): [T|null, (data: T) => void ] {
    const [payload, setState] = useState(null);

    const setPayload = useCallback((data: T) => {
        const event = new CustomEvent<T>(eventKey, {
            detail: data
        });

        document.dispatchEvent(event);
    }, [eventKey]);

    useEffect(() => {
        if (attach) {
            const ln = (e: Event) => {
                setState((e as any).detail);
            };

            document.addEventListener(eventKey, ln);
            return () => {
                document.removeEventListener(eventKey, ln);
            };
        }
    }, [attach, eventKey]);

    return [payload, setPayload];
}
