
import React from 'react';
import { StyleGenerator } from '../styling/style-generator.service';
import { ContentBlockEntity } from './content-block.entity';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { RestClient } from '../../rest-sdk/rest-client';
import { SanitizerService } from '../../services/sanitizer-service';

export async function ContentBlock(props: WidgetContext<ContentBlockEntity>) {

    let dataAttributes = htmlAttributes(props);

    let content = props.model.Properties.Content;
    if (props.model.Properties?.SharedContentID && props.model.Properties.SharedContentID !== '00000000-0000-0000-0000-000000000000') {
        const contentItem = await RestClient.getSharedContent(props.model.Properties.SharedContentID, props.requestContext.culture);
        content = contentItem.Content;
    }

    const tagName = props.model.Properties.TagName || 'div';
    dataAttributes.dangerouslySetInnerHTML = {
        __html: SanitizerService.sanitizeHtml(content || '')
    };

    let cssClasses = [];
    if (props.model.Properties.WrapperCssClass) {
        cssClasses.push(props.model.Properties.WrapperCssClass);
    }

    if (props.model.Properties.Paddings) {
        cssClasses.push(StyleGenerator.getPaddingClasses(props.model.Properties.Paddings));
    }

    if (props.model.Properties.Margins) {
        cssClasses.push(StyleGenerator.getMarginClasses(props.model.Properties.Margins));
    }

    if (cssClasses.length > 0) {
        dataAttributes['className'] = cssClasses.join(' ');
    }

    const customAttributes = getCustomAttributes(props.model.Properties.Attributes, 'ContentBlock');
    dataAttributes = Object.assign(dataAttributes, customAttributes);

    return React.createElement(tagName, dataAttributes);
}
