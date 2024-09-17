'use client';

import { useEffect, useState } from 'react';
import { TransferableRequestContext } from '../../editor/request-context';
import { EVENTS, PersonalizedWidgetsPayload, useSfEvents } from '../../pages/useSfEvents';
import React from 'react';

interface RenderNodeValues {
    tag: string;
    innterHtml: string;
    attributes: {[key: string]: any};
};

export function RenderLazyForSSR(props: {id: string, requestContext: TransferableRequestContext}) {
    const [ htmls ] = useSfEvents<PersonalizedWidgetsPayload>(EVENTS.PERSONALIZED_WIDGETS_LOADED, true);
    const [renderValues, setRenderValues] = useState<RenderNodeValues[] | null>(null);

    useEffect(() => {
        if (htmls && htmls[props.id] && htmls[props.id].ssr) {
            const mock = document.createElement('div');
            mock.innerHTML = htmls[props.id].data as string;
            const renderNodes: RenderNodeValues[] = [];
            mock.childNodes.forEach(x => {
                if (x.nodeType === Node.ELEMENT_NODE) {
                    const currentChild = x as Element;
                    const tag = currentChild.tagName.toLowerCase();
                    const attributes = currentChild.attributes;
                    const attrObj: {[key: string]: any} = extractAttributes(attributes);

                    renderNodes.push({
                        tag,
                        innterHtml: currentChild.innerHTML,
                        attributes: attrObj
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
                dangerouslySetInnerHTML: {__html: x.innterHtml},
                key: `lazy-${props.id}-${i}`,
                ...x.attributes
            });
        })}
    </>
    );
}

function extractAttributes(attributes: NamedNodeMap) {
    const attrObj: {[key: string]: any} = {};

    for (const attr of attributes) {
        let attrName = attr.name;
        switch (attrName) {
            case 'class': attrName = 'className'; break;
            case 'novalidate': attrName = 'noValidate'; break;
            case 'for': attrName = 'htmlFor'; break;
            default: break;
        }

        attrObj[attrName] = attr.value;
    }

    return attrObj;
}
