'use client';

import { useEffect, useState } from 'react';
import { TransferableRequestContext } from '../../editor/request-context';
import { EVENTS, PersonalizedWidgetsPayload, useSfEvents } from '../../pages/useSfEvents';
import { SanitizerService } from '../../services/sanitizer-service';
import React from 'react';

interface RenderNodeValues {
    tag: string;
    innerHtml: string;
    attributes: Record<string, unknown>;
};

export function RenderLazyForSSR(props: {id: string, requestContext: TransferableRequestContext}) {
    const [ htmls ] = useSfEvents<PersonalizedWidgetsPayload>(EVENTS.PERSONALIZED_WIDGETS_LOADED, true);
    const [renderValues, setRenderValues] = useState<RenderNodeValues[] | null>(null);

    useEffect(() => {
        if (htmls && htmls[props.id] && htmls[props.id].ssr) {
            const responseDocument = new DOMParser().parseFromString(htmls[props.id].data as string, 'text/html');
            const renderNodes: RenderNodeValues[] = [];
            responseDocument.body.childNodes.forEach(x => {
                if (x.nodeType === Node.ELEMENT_NODE) {
                    const sanitizedChild = SanitizerService.getInstance().sanitizeElement(x as HTMLElement);
                    if (!sanitizedChild) {
                        return;
                    }

                    renderNodes.push({
                        tag: sanitizedChild.tagName.toLowerCase(),
                        innerHtml: sanitizedChild.innerHTML,
                        attributes: extractAttributes(sanitizedChild.attributes)
                    });
                }
            });

            setRenderValues(renderNodes);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [htmls]);

    return htmls && htmls[props.id] && htmls[props.id].ssr && renderValues?.length && (
    <>
      {renderValues.map((x, i) => {
            return React.createElement(x.tag, {
                ...x.attributes,
                dangerouslySetInnerHTML: {__html: x.innerHtml},
                key: `lazy-${props.id}-${i}`
            });
        })}
    </>
    );
}

function extractAttributes(attributes: NamedNodeMap) {
    const attrObj: Record<string, unknown> = {};

    for (const attr of attributes) {
        let attrName = attr.name;
        let attrValue: unknown = attr.value;

        switch (attrName) {
            case 'class': attrName = 'className'; break;
            case 'novalidate': attrName = 'noValidate'; break;
            case 'for': attrName = 'htmlFor'; break;
            case 'style':
                // Convert style string to object
                attrValue = parseStyleString(attr.value);
                break;
            default: break;
        }

        attrObj[attrName] = attrValue;
    }

    return attrObj;
}

function parseStyleString(styleStr: string): {[key: string]: string} {
    const styleObj: {[key: string]: string} = {};

    if (!styleStr) {
        return styleObj;
    }

    styleStr.split(';').forEach(rule => {
        const [property, value] = rule.split(':').map(s => s.trim());
        if (property && value) {
            // Handle CSS custom properties (variables) that start with --
            if (property.startsWith('--')) {
                styleObj[property] = value;
            } else {
                // Convert kebab-case to camelCase for React
                const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                styleObj[camelProperty] = value;
            }
        }
    });

    return styleObj;
}
