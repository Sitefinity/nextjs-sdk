'use client';

import { IntentDrivenContentEntity } from './intent-driven-content.entity';
import { SectionType } from './section-type';
import { RenderView } from '../../common/render-view';
import { IntentDrivenContentViewProps, IntentDrivenContentDefaultView } from './intent-driven-content-default.view';
import { getMinimumWidgetContext, WidgetContext } from '../../../editor/widget-framework/widget-context';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';

export function IntentDrivenContent(props: WidgetContext<IntentDrivenContentEntity>) {
    const attr = htmlAttributes(props);
    const model = props.model.Properties;
    const sections = model.SectionsConfiguration || [{ sectionType: SectionType.TitleAndSummary }];

    const query = model.DefaultQuery;
    const noIntentAction = model.NoProvidedIntent;
    const siteId = props.requestContext.layout.SiteId;
    const pageId = props.requestContext.layout.Id;
    const language = props.requestContext.culture;
    const cssClasses = {
        Content: model.ContentCssClass,
        PageTitleAndSummary: model.PageTitleAndSummaryCssClass,
        SectionTitleAndSummary: model.SectionTitleAndSummaryCssClass,
        RichText: model.RichTextCssClass,
        ContentItemsList: model.ContentItemsListCssClass,
        ContentItemsCards: model.ContentItemsCardsCssClass,
        Hero: model.HeroCssClass,
        Faq: model.FaqCssClass
    };

    attr['className'] = cssClasses?.Content || '';

    const viewProps: IntentDrivenContentViewProps = {
        attributes: attr,
        defaultQuery: query,
        widgetContext: getMinimumWidgetContext(props),
        noIntentAction: noIntentAction,
        siteId: siteId,
        pageId: pageId,
        language: language,
        sections: sections,
        isEdit: props.requestContext.isEdit
    };

    sections.forEach(section => {
        switch (section.sectionType) {
            case SectionType.TitleAndSummary:
                section.cssClassName = cssClasses?.PageTitleAndSummary || '';
                break;
            case SectionType.RichText:
                section.cssClassName = cssClasses?.RichText || '';
                break;
            case SectionType.FAQ:
                section.cssClassName = cssClasses?.Faq || '';
                break;
            case SectionType.Hero:
                section.cssClassName = cssClasses?.Hero || '';
                break;
            case SectionType.ContentList:
                section.cssClassName = cssClasses?.ContentItemsList || '';
                break;
            case SectionType.ContentListCards:
                section.cssClassName = cssClasses?.ContentItemsCards || '';
                break;
            default:
                section.cssClassName = '';
                break;
        }
    });

    return (
      <RenderView viewProps={viewProps}
        widgetKey={props.model.Name}
        viewName={model.SfViewName}>
        <IntentDrivenContentDefaultView {...viewProps} />
      </RenderView>
    );
}
