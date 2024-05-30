
import { SanitizerService } from '../../services/sanitizer-service';
import { Dictionary } from '../../typings/dictionary';
import { LinkModel } from './link-model';
import { WidgetContext } from './widget-context';

export function htmlAttributes(widgetContext: WidgetContext<any>, error: string | undefined = undefined): { [key: string]: any } {
    if (!widgetContext.requestContext.isEdit) {
        return {};
    }

    const model = widgetContext.model;
    const metadata = widgetContext.metadata;
    const editorMetadata = metadata?.editorMetadata;

    const attributes: any = {
        'data-sfname': model.Name,
        'data-sftitle': SanitizerService.sanitizeHtml(model.Caption || editorMetadata?.Title || model.Name),
        'data-sfid' : model.Id,
        'data-sfisorphaned': false,
        'data-sficonname': editorMetadata?.IconName
    };

    attributes['data-sfisemptyvisualhidden'] = false;
    attributes['data-sfisempty'] = false;
    attributes['draggable'] = true;

    if (editorMetadata) {
        if (editorMetadata.EmptyIcon) {
            attributes['data-sfemptyicon'] = editorMetadata.EmptyIcon;
        }

        if (editorMetadata.EmptyIconAction) {
            attributes['data-sfemptyiconaction'] = editorMetadata.EmptyIconAction;
        }

        if (editorMetadata.EmptyIconText) {
            attributes['data-sfemptyicontext'] = editorMetadata.EmptyIconText;
        }

        if (editorMetadata.HideEmptyVisual) {
            attributes['data-sfisemptyvisualhidden'] = editorMetadata.HideEmptyVisual;
        }

        if (editorMetadata.HasQuickEditOperation) {
            attributes['data-sfhasquickeditoperation'] = true;
        }

        attributes['data-sfiscontentwidget'] = editorMetadata.Category !== 'Layout & Presets' && editorMetadata.Category !== 'Layout';
    }

    if (error) {
        attributes['data-sferror'] = error;
    }

    return attributes;
}

export function setHideEmptyVisual(attributes: {[key: string]: any}, value: boolean) {
    attributes['data-sfisemptyvisualhidden'] = value;
}

export function setWarning(attributes: {[key: string]: any}, warning: string) {
    attributes['data-sfwarning'] = warning;
}

export const generateAnchorAttrsFromLink = (linkModel?: LinkModel | null, classList: string = '') => {
    if (!linkModel) {
        return null;
    }

    let href = linkModel.href || '';
    if (href.indexOf('?') < 0 && linkModel.queryParams) {
        const queryParamsEncoded = linkModel.queryParams
            .split('&')
            .map(x => {
                return x.split('=')
                    .map(x => {
                        if (x) {
                            return encodeURIComponent(x);
                        } else {
                            return x;
                        }
                    });
        }).map(x => x.join('=')).join('&');
        href += `?${queryParamsEncoded}`;
    }

    if (href.indexOf('#') < 0 && linkModel.anchor) {
        href += `#${linkModel.anchor}`;
    }

    let attributes = {} as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    attributes.href = href;

    if (linkModel.target) {
        attributes.target = linkModel.target;
    }

    if (linkModel.tooltip) {
        attributes.title = linkModel.tooltip;
    }

    if (linkModel.classList?.length) {
        classList = `${classList} ${linkModel.classList.join(' ')}`;
    }

    if (!!classList.trim()) {
        attributes.className = classList;
    }

    if (linkModel.attributes) {
        attributes = {...attributes, ... linkModel.attributes};
    }


    return attributes;
};

export const getCustomAttributes = (attributes: { [key: string]: Array<{ Key: string, Value: string }> } | null | undefined, part: string): Dictionary => {
    if (!attributes || !attributes[part]){
        return {};
    }

    let returnVal: Dictionary = {};

    attributes[part].forEach((attribute) => {
        returnVal[attribute.Key] = attribute.Value;
    });

    return returnVal;
};
