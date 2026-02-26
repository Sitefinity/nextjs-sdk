import { SitefinityAssistantEntity, DisplayMode } from './sitefinity-assistant.entity';
import { WidgetContext } from '../../editor/widget-framework/widget-context';
import { htmlAttributes, getCustomAttributes } from '../../editor/widget-framework/attributes';
import { Tracer } from '@progress/sitefinity-nextjs-sdk/diagnostics/empty';
import { SitefinityAssistantConfig } from './sitefinity-assistant-config';
import { SitefinityAssistantApiClient } from './sitefinity-assistant-api-client';
import { RestClient } from '@progress/sitefinity-nextjs-sdk/rest-sdk';
import Script from 'next/script';
import { AssistantApiConstants } from './assistant-api-constants';

// Re-export DisplayMode for use in other components
export { DisplayMode } from './sitefinity-assistant.entity';

/**
 * Gets the URL of a single selected image from MixedContentContext
 * @param image The MixedContentContext containing image selection
 * @returns Promise with image URL or null if no single image is selected
 */
async function getSingleSelectedImageUrlAsync(image: any | null | undefined): Promise<string | null> {
    if (!image || !image.ItemIdsOrdered || image.ItemIdsOrdered.length !== 1) {
        return null;
    }

    let imageItem : any;

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

export async function SitefinityAssistant(props: WidgetContext<SitefinityAssistantEntity>) {
    const { span, ctx } = Tracer.traceWidget(props, true);
    const entity = props.model.Properties;
    let dataAttributes = htmlAttributes(props);

    // Get version information from Sitefinity Assistant admin API
    const versionInfo = await SitefinityAssistantApiClient.getVersionInfoAsync(entity.AssistantType);
    const version = versionInfo?.ProductVersion;

    const cdnUrls = {
        jqueryUrl: SitefinityAssistantConfig.getCdnUrl('jquery.min.js', version),
        markedUrl: SitefinityAssistantConfig.getCdnUrl('marked.min.js', version),
        chatJsUrl: SitefinityAssistantConfig.getCdnUrl('sf-assistant-chat.js', version),
        chatServiceUrl: SitefinityAssistantConfig.getCdnUrl(entity.AssistantType === AssistantApiConstants.PARAG ?
                'parag-chat-service.js' :
                'azure-assistant-chat-service.js', version),
        widgetCssUrl: SitefinityAssistantConfig.getCdnUrl('sf-assistant-chat-widget.min.css', version),
        widgetJsUrl: SitefinityAssistantConfig.getCdnUrl('sf-assistant-widget.js', version)
    };

    // Get image URLs from MixedContentContext properties
    const assistantAvatarUrl = await getSingleSelectedImageUrlAsync(entity.AssistantAvatar);
    const openingChatIconUrl = await getSingleSelectedImageUrlAsync(entity.OpeningChatIcon);
    const closingChatIconUrl = await getSingleSelectedImageUrlAsync(entity.ClosingChatIcon);

    // Use default avatar if none selected, similar to .NET Core implementation
    const finalAvatarUrl = assistantAvatarUrl || SitefinityAssistantConfig.getCdnUrl('chat-avatar.svg', version);

    // Handle CSS classes
    let cssClasses = [];
    if (entity.CssClass) {
        cssClasses.push(entity.CssClass);
    }

    if (cssClasses.length > 0) {
        dataAttributes['className'] = cssClasses.join(' ');
    }

    // Add custom attributes
    const customAttributes = getCustomAttributes(entity.Attributes, 'SitefinityAssistant');
    dataAttributes = Object.assign(dataAttributes, customAttributes);

        // Generate widget configuration JSON
        const widgetConfig = {
            id: entity.DisplayMode === DisplayMode.Inline ? 'sf-assistant-inline-chat' : 'sf-assistant-modal-chat',
            display: {
                mode: entity.DisplayMode === DisplayMode.Inline ? 'inline' : 'modal',
                ...(entity.DisplayMode === DisplayMode.Inline && {
                    containerId: entity.ContainerId
                }),
                ...(entity.DisplayMode === DisplayMode.Modal && {
                    launcher: {
                        openIconUrl: openingChatIconUrl || '',
                        closeIconUrl: closingChatIconUrl || ''
                    }
                })
            },
            chat: {
                bot: {
                    name: entity.Nickname,
                    avatarUrl: finalAvatarUrl
                },
                input: {
                    supportsMultilineText: true,
                    placeholder: entity.PlaceholderText
                },
                notice: entity.Notice,
                css: entity.CustomCss
            },
            serviceSettings: {
                serviceType: entity.AssistantType === AssistantApiConstants.PARAG ?
                    'ProgressARAGChatService' :
                    'AzureAssistantChatService',
                greetingsMessage: entity.GreetingMessage,
                endpoint: SitefinityAssistantConfig.getChatServiceUrl(entity.AssistantType),
                assistantApiKey: entity.AssistantApiKey,
                knowledgeBoxName: entity.KnowledgeBoxName,
                configurationName: entity.ConfigurationName,
                showFeedbackButtons: entity.ShowFeedback,
                showSources: entity.ShowSources,
                additionalQueryParams: {
                    sf_site: props.requestContext.layout.SiteId
                }
            }
        };

    return (
      <div {...dataAttributes}>
        {/* Handle edit mode placeholder for non-empty API key */}
        {props.requestContext.isEdit && (entity.AssistantApiKey || entity.KnowledgeBoxName) && (
          <div style={{padding: '10px'}}>
            <div style={{backgroundColor:'#dcecf5', padding: '10px', borderRadius: '5px'}}>
              <p style={{margin: 0}}>AI assistant is configured.</p>
              <p style={{margin: 0}}>Use "Preview" to check assistant's display on the page.</p>
            </div>
          </div>
        )}

        {/* Normal rendering when AssistantApiKey is provided */}
        {!props.requestContext.isEdit && (entity.AssistantApiKey || entity.KnowledgeBoxName) && (
          <>
            {/* Load CSS first */}
            <link rel="stylesheet" type="text/css" href={cdnUrls.widgetCssUrl} />

            {/* Custom CSS if provided */}
            {entity.CustomCss && (
              <link rel="stylesheet" type="text/css" href={entity.CustomCss} />
            )}

            <Script src={cdnUrls.jqueryUrl} strategy="lazyOnload" async={false} />
            <Script src={cdnUrls.markedUrl} strategy="lazyOnload" async={false} />
            <Script src={cdnUrls.chatJsUrl} strategy="lazyOnload" async={false} />
            <Script src={cdnUrls.chatServiceUrl} strategy="lazyOnload" async={false} />
            <Script src={cdnUrls.widgetJsUrl} strategy="lazyOnload" async={false} />

            {/* Widget configuration JSON - same for both modes */}
            <script
              type="application/json"
              className="sf-assistant-widget-data"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(widgetConfig)
              }}
            />

            {/* Container div only for inline mode */}
            {entity.DisplayMode === DisplayMode.Inline && (
              <div
                id={entity.ContainerId}
                {...customAttributes}
                className={entity.CssClass || ''}
              />
            )}
          </>
        )}

        {Tracer.endSpan(span)}
      </div>
    );
}
