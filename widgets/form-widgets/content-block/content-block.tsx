
import React from 'react';
import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { SanitizerService } from '../../../services/sanitizer-service';
import { FormContentBlockEntity } from './content-block.entity';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';

export function FormContentBlock(props: WidgetContext<FormContentBlockEntity>) {
    const { span } = Tracer.traceWidget(props, false);
    const dataAttributes = htmlAttributes(props);

    const content = props.model.Properties.Content;

    const tagName = props.model.Properties.TagName || 'div';
    dataAttributes.dangerouslySetInnerHTML = {
        __html: SanitizerService.getInstance().sanitizeHtml(content || '')
    };

    const cssClasses = classNames(props.model.Properties.WrapperCssClass);
    dataAttributes['className'] = cssClasses;

    return (
      <>
        {React.createElement(tagName, dataAttributes)}
        {Tracer.endSpan(span)}
      </>
    );
}
