import { WidgetEntity } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-entity';
import { ContentSection } from '@progress/sitefinity-widget-designers-sdk/decorators/content-section';
import { DisplayName } from '@progress/sitefinity-widget-designers-sdk/decorators/display-name';
import { Description } from '@progress/sitefinity-widget-designers-sdk/decorators/description';
import { DataType } from '@progress/sitefinity-widget-designers-sdk/decorators/data-type';
import { DefaultValue } from '@progress/sitefinity-widget-designers-sdk/decorators/default-value';
import { KnownFieldTypes } from '@progress/sitefinity-widget-designers-sdk/common';
import { ConditionalVisibility } from '@progress/sitefinity-widget-designers-sdk/decorators/conditional-visibility';
import { Category, PropertyCategory } from '@progress/sitefinity-widget-designers-sdk/decorators/category';
import { Attributes } from '@progress/sitefinity-widget-designers-sdk/decorators/attributes';
import { Placeholder } from '@progress/sitefinity-widget-designers-sdk/decorators/placeholder';
import { Choice } from '@progress/sitefinity-widget-designers-sdk/decorators/choice';
import { WidgetLabel } from '@progress/sitefinity-widget-designers-sdk/decorators/widget-label';
import { Content } from '@progress/sitefinity-widget-designers-sdk/decorators/content';
import { MixedContentContext } from '../../editor/widget-framework/mixed-content-context';

export enum DisplayMode {
    Modal = 'Modal',
    Inline = 'Inline'
}

@WidgetEntity('SitefinityAssistant', 'AI assistant')
export class SitefinityAssistantEntity {
    @ContentSection('AI assistant', 0)
    @DisplayName('AI assistant type')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetAvailableAssistantModules()', ServiceWarningMessage: 'No AI assistants are found.' })
    @Placeholder('Select assistant type')
    @Description('[{"Type":1,"Chunks":[{"Value":"Sitefinity AI Assistant: ","Presentation":[0]},{"Value":"Answers from your site\'s published content only.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Progress Agentic RAG: ","Presentation":[0]},{"Value":"Answers from the selected Agentic RAG connection.","Presentation":[]}]}]')
    AssistantType: string | null = null;

    @ContentSection('AI assistant', 1)
    @DisplayName('Agentic RAG connection')
    @Description('A connection to a specific knowledge box in Progress Agentic RAG. Select which connection this widget should use to answer questions.')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetConfiguredKnowledgeBoxes()', ServiceWarningMessage: 'No Agentic RAG connections are found.' })
    @Placeholder('Select connection')
    @ConditionalVisibility('{"conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG"}]}')
    KnowledgeBoxName: string | null = null;

    @ContentSection('AI assistant', 2)
    @DisplayName('Search configuration')
    @Description('A saved set of search settings that the AI assistant uses to find content.')
    @DataType(KnownFieldTypes.Choices)
    @Choice({ ServiceUrl: '/Default.GetSearchConfigurations(knowledgeBoxName=\'{0}\')', ServiceCallParameters: '[{ "knowledgeBoxName" : "{0}"}]' })
    @ConditionalVisibility('{"conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG"}]}')
    ConfigurationName: string | null = null;

    @ContentSection('AI assistant', 1)
    @DisplayName('Select an AI assistant')
    @Description('[{"Type":1,"Chunks":[{"Value":"AI assitants are created and managed in","Presentation":[]},{"Value":"Administration > AI assistants","Presentation":[2]}]}]')
    @DataType(KnownFieldTypes.Choices)
    @Placeholder('Select')
    @Choice({ ServiceUrl: '/Default.GetAiAssistantChoices()', ServiceWarningMessage: 'No AI assistants are found.' })
    @DefaultValue('')
    @ConditionalVisibility('{"conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"SAIA"}]}')
    AssistantApiKey: string | null = null;

    @ContentSection('AI assistant', 2)
    @DisplayName('Nickname of the assistant')
    @Description('Name displayed before assistant\'s messages in the chat.')
    @ConditionalVisibility('{"operator":"Or","conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG" },{"fieldName":"AssistantType","operator":"Equals","value":"SAIA" }]}')
    Nickname: string = 'AI assistant';

    @ContentSection('AI assistant', 3)
    @DisplayName('Greeting message')
    @Description('You can customize the bot\'s initial words by adding a phrase that triggers conversation on a specific topic.')
    @DataType(KnownFieldTypes.TextArea)
    @ConditionalVisibility('{"operator":"Or","conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG" },{"fieldName":"AssistantType","operator":"Equals","value":"SAIA" }]}')
    GreetingMessage: string | null = null;

    @ContentSection('AI assistant', 4)
    @DisplayName('Avatar of the assistant')
    @Content({
        Type: 'Telerik.Sitefinity.Libraries.Model.Image',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{"operator":"Or","conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG" },{"fieldName":"AssistantType","operator":"Equals","value":"SAIA" }]}')
    AssistantAvatar?: MixedContentContext;

    @ContentSection('AI assistant', 5)
    @DisplayName('Display sources')
    @Description('In answers, display links to sources of information.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice('[{"Title":"Yes","Name":"Yes","Value":"True","Icon":null},{"Title":"No","Name":"No","Value":"False","Icon":null}]')
    @ConditionalVisibility('{"conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG"}]}')
    ShowSources: boolean = true;

    @ContentSection('AI assistant', 6)
    @DisplayName('Enable visitor feedback')
    @Description('If enabled, site visitors can provide feedback on the assistant\'s answer in the chat window.')
    @DefaultValue(true)
    @DataType(KnownFieldTypes.ChipChoice)
    @Choice('[{"Title":"Yes","Name":"Yes","Value":"True","Icon":null},{"Title":"No","Name":"No","Value":"False","Icon":null}]')
    @ConditionalVisibility('{"conditions":[{"fieldName":"AssistantType","operator":"Equals","value":"PARAG"}]}')
    ShowFeedback: boolean = true;

    @ContentSection('Chat window', 0)
    @DisplayName('Chat window mode')
    @Description('[{"Type":1,"Chunks":[{"Value":"Display overlay: ","Presentation":[0]},{"Value":"Chat appears in a small window, usually in the bottom right corner of the screen. It requires user interaction to open and overlays parts of the page content.","Presentation":[]}]},{"Type":1,"Chunks":[{"Value":"Display inline: ","Presentation":[0]},{"Value":"Chat area is integrated into the page layout and does not overlay other elements. Suitable for long assistant responses and prompts.","Presentation":[]}]}]')
    @DataType(KnownFieldTypes.RadioChoice)
    @Choice([
        { Title: 'Display overlay', Value: DisplayMode.Modal },
        { Title: 'Display inline', Value: DisplayMode.Inline }
    ])
    DisplayMode: DisplayMode = DisplayMode.Modal;

    @ContentSection('Chat window', 1)
    @DisplayName('Opening chat icon')
    @Description('Select a custom icon for opening chat window. If left empty, default icon will be displayed.')
    @Content({
        Type: 'Telerik.Sitefinity.Libraries.Model.Image',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{"conditions":[{"fieldName":"DisplayMode","operator":"Equals","value":"Modal"}]}')
    OpeningChatIcon?: MixedContentContext;

    @ContentSection('Chat window', 2)
    @DisplayName('Closing chat icon')
    @Description('Select a custom icon for closing chat window. If left empty, default icon will be displayed.')
    @Content({
        Type: 'Telerik.Sitefinity.Libraries.Model.Image',
        AllowMultipleItemsSelection: false
    })
    @ConditionalVisibility('{"conditions":[{"fieldName":"DisplayMode","operator":"Equals","value":"Modal"}]}')
    ClosingChatIcon?: MixedContentContext;

    @ContentSection('Chat window', 3)
    @DisplayName('Container ID')
    @Description('ID of the HTML element that will host the chat widget.')
    @DataType('string')
    @DefaultValue('sf-assistant-chat-container')
    @ConditionalVisibility('{"conditions":[{"fieldName":"DisplayMode","operator":"Equals","value":"Inline"}]}')
    ContainerId: string = 'sf-assistant-chat-container';

    @ContentSection('Message box', 0)
    @DisplayName('Placeholder text in the message box')
    @DataType('string')
    @DefaultValue('Ask anything...')
    PlaceholderText: string = 'Ask anything...';

    @ContentSection('Message box', 1)
    @DisplayName('Notice')
    @DefaultValue('You are interacting with an AI-powered assistant and the responses are generated by AI.')
    @Description('Text displayed under the message box, informing users that they are interacting with AI.')
    @DataType(KnownFieldTypes.TextArea)
    Notice: string = 'You are interacting with an AI-powered assistant and the responses are generated by AI.';

    @WidgetLabel()
    SfWidgetLabel: string = 'AI assistant';

    @DisplayName('CSS class')
    @Category(PropertyCategory.Advanced)
    CssClass: string | null = null;

    @Category(PropertyCategory.Advanced)
    @DisplayName('CSS for custom design')
    @Placeholder('type URL or path to file...')
    CustomCss: string | null = null;

    @Attributes('SitefinityAssistant')
    Attributes?: { [key: string]: Array<{ Key: string, Value: string}> };
}
