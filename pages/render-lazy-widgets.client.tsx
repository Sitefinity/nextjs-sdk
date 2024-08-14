
'use client';

import { RenderWidgetService } from '../services/render-widget-service';
import { widgetRegistry } from '@widgetregistry';
import { ServiceMetadataDefinition, ServiceMetadata } from '../rest-sdk/service-metadata';
import { SdkItem } from '../rest-sdk/dto/sdk-item';
import { useEffect } from 'react';
import { EVENTS, PersonalizedWidgetsPayload, useSfEvents } from './useSfEvents';

export function RenderLazyWidgetsClient({ metadata, taxonomies, url }: { metadata: ServiceMetadataDefinition, taxonomies: SdkItem[], url: string }) {
    RenderWidgetService.widgetRegistry = widgetRegistry;
    ServiceMetadata.serviceMetadataCache = metadata;
    ServiceMetadata.taxonomies = taxonomies;

    const [_, setWidetsModels] = useSfEvents<PersonalizedWidgetsPayload>(EVENTS.PERSONALIZED_WIDGETS_LOADED, false);

    useEffect(() => {
        const correlationId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        if (typeof window !== 'undefined') {
            (window as any)['sfCorrelationId'] = correlationId;
            const renderLazyWidgetsUrl = `/render-lazy?pageUrl=${encodeURIComponent(url)}&correlationId=${correlationId}&referer=${encodeURIComponent(document.referrer)}&`;

            const sendRequest = function () {
                fetch(renderLazyWidgetsUrl).then((response) => {
                    response.text().then((lazyWidgetsHtml: string) => {
                        const fakeHtmlElement = document.createElement('html');
                        fakeHtmlElement.innerHTML = lazyWidgetsHtml;

                        const wrappingElement = fakeHtmlElement.querySelector('div[id=\'widgetPlaceholder\']');
                        if (!wrappingElement) {
                            return;
                        }

                        const childrenLazyWidgets = wrappingElement.querySelectorAll('div');
                        if (childrenLazyWidgets && childrenLazyWidgets.length > 0) {
                            const models: PersonalizedWidgetsPayload = {};
                            childrenLazyWidgets.forEach(lazyWidgetContainer => {
                                const widgetId = lazyWidgetContainer.getAttribute('id');
                                if (widgetId) {
                                    const isCSR = lazyWidgetContainer.getAttribute('data-sfmodel');
                                    if (isCSR) {
                                        const model = JSON.parse(lazyWidgetContainer.innerHTML);
                                        models[widgetId] = {
                                            ssr: false,
                                            data: model
                                        };
                                        return;
                                    } else {
                                        const renderResult = lazyWidgetContainer.innerHTML;
                                        models[widgetId] = {
                                            ssr: true,
                                            data: renderResult
                                        };
                                    }
                                }
                            });

                            if (Object.keys(models).length) {
                                setWidetsModels(models);
                            }
                        }
                    });
                });
            };

            if ((window as any).InsightInitScript) {
                if ((window as any).InsightInitScript.cookiesManaged) {
                    sendRequest();
                } else {
                    window.addEventListener('insCookiesMngmntDone', sendRequest);
                }
            } else {
                sendRequest();
            }
        }
    }, [setWidetsModels, url]);

    return null;
}

