import { AnswerEntity } from './answer.entity';
import { AnswerViewProps } from './answer.view-props';
import { AnswerDefaultView } from './answer.view';
import {
    WidgetContext,
    getMinimumWidgetContext,
    htmlAttributes,
    getCustomAttributes,
    classNames
} from '@progress/sitefinity-nextjs-sdk';
import { StyleGenerator } from '@progress/sitefinity-nextjs-sdk/widgets/styling';
import { RenderView } from '@progress/sitefinity-nextjs-sdk/widgets';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { SitefinityAssistantConfig } from '../sitefinity-assistant/sitefinity-assistant-config';
import { SitefinityAssistantApiClient } from '../sitefinity-assistant/sitefinity-assistant-api-client';
import { AssistantApiConstants } from '../sitefinity-assistant/assistant-api-constants';

/**
 * Gets the URL of a single selected image from MixedContentContext.
 */
async function getSingleSelectedImageUrlAsync(image: any | null | undefined): Promise<string | null> {
    if (!image || !image.ItemIdsOrdered || image.ItemIdsOrdered.length !== 1) {
        return null;
    }

    let imageItem: any;

    try {
        imageItem = await RestClient.getItem<any>({
            type: 'Telerik.Sitefinity.Libraries.Model.Image',
            id: image.ItemIdsOrdered[0]
        });
    } catch {
        imageItem = null;
    }

    if (imageItem && imageItem.Id === image.ItemIdsOrdered[0]) {
        return imageItem.Url || null;
    }

    return null;
}

export async function Answer(props: WidgetContext<AnswerEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    let dataAttributes = htmlAttributes(props);
    const defaultClass = entity.CssClass;
    const marginClass = entity.Margins && StyleGenerator.getMarginClasses(entity.Margins);

    dataAttributes['className'] = classNames(defaultClass, marginClass);
    const customAttributes = getCustomAttributes(entity.Attributes, 'Answer');

    const versionInfo = await SitefinityAssistantApiClient.getVersionInfoAsync(AssistantApiConstants.PARAG);
    const version = versionInfo?.ProductVersion;

    const assistantAvatarUrl = await getSingleSelectedImageUrlAsync(entity.AssistantAvatar) || SitefinityAssistantConfig.getCdnUrl('chat-avatar.svg', version);

    const cdnUrls = {
        jqueryUrl: SitefinityAssistantConfig.getCdnUrl('jquery.min.js', version),
        markedUrl: SitefinityAssistantConfig.getCdnUrl('marked.min.js', version),
        chatJsUrl: SitefinityAssistantConfig.getCdnUrl('sf-assistant-chat.js', version),
        chatServiceUrl: SitefinityAssistantConfig.getCdnUrl('parag-chat-service.js', version),
        widgetCssUrl: SitefinityAssistantConfig.getCdnUrl('sf-assistant-chat-widget.min.css', version),
        widgetJsUrl: SitefinityAssistantConfig.getCdnUrl('sf-assistant-widget.js', version)
    };

    const viewProps: AnswerViewProps<AnswerEntity> = {
        title: entity.Title || 'AI answer',
        assistantAvatarUrl: assistantAvatarUrl,
        showSources: entity.ShowSources,
        showFeedback: entity.ShowFeedback,
        searchedPhraseLabel: entity.ShowSearchedPhrase ? entity.SearchedPhraseLabel || 'Answer for "{0}"' : null,
        notice: entity.ShowNotice ? entity.Notice || 'AI answer may contain mistakes.' : null,
        positiveFeedbackTooltip: entity.PositiveFeedbackTooltip || 'Helpful',
        negativeFeedbackTooltip: entity.NegativeFeedbackTooltip || 'Not helpful',
        thankYouMessage: entity.ThankYouMessage || 'Thank you for your feedback!',
        expandAnswerLabel: entity.ExpandAnswerLabel || 'Show more',
        collapseAnswerLabel: entity.CollapseAnswerLabel || 'Show less',
        loadingLabel: entity.LoadingLabel || 'Putting together an answer',
        cdnUrls,
        attributes: { ...dataAttributes, ...customAttributes },
        widgetContext: getMinimumWidgetContext(props)
    };

    const viewName = props.model.Properties.SfViewName;

    return (
      <RenderView
        viewName={viewName}
        widgetKey={props.model.Name}
        traceSpan={span}
        viewProps={viewProps}>
        <AnswerDefaultView {...viewProps} />
      </RenderView>
    );
}
