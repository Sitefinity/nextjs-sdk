
'use client';

import { RenderWidgetService } from '../services/render-widget-service';
import { widgetRegistry } from '@widgetregistry';
import { ServiceMetadataDefinition, ServiceMetadata } from '../rest-sdk/service-metadata';
import { SdkItem } from '../rest-sdk/dto/sdk-item';

export function RenderLazyWidgetsClient({ metadata, taxonomies }: { metadata: ServiceMetadataDefinition, taxonomies: SdkItem[], url :string }) {
    RenderWidgetService.widgetRegistry = widgetRegistry;
    ServiceMetadata.serviceMetadataCache = metadata;
    ServiceMetadata.taxonomies = taxonomies;

    if (typeof window === 'undefined') {
        return <></>;
    }

    const correlationId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    (window as any)['sfCorrelationId'] = correlationId;

    if (typeof window !== 'undefined') {
        const renderLazyWidgetsUrl = `/render-lazy?pageUrl=${encodeURIComponent(window.location.href)}&correlationId=${correlationId}&referer=${encodeURIComponent(document.referrer)}&`;

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
                        childrenLazyWidgets.forEach((lazyWidgetContainer) => {
                            const widgetId = lazyWidgetContainer.getAttribute('id');
                            if (widgetId) {
                                const element = document.getElementById(widgetId);
                                if (element) {
                                    const renderResult = lazyWidgetContainer.firstElementChild;
                                    if (renderResult) {
                                        element.parentElement?.insertBefore(renderResult, element);
                                        if (element.parentNode) {
                                            element.parentNode.removeChild(element);
                                        }

                                        const event = new CustomEvent('widgetLoaded', {
                                            detail: {
                                                element: renderResult,
                                                model: undefined
                                            }
                                        });

                                        document.dispatchEvent(event);
                                    }
                                }
                            }
                        });
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

    return <></>;
}

