import DOMPurify, { Config } from 'isomorphic-dompurify';

export interface SanitizerConfig {
    additionalAtributes?: string[] | undefined;
    additionalDataUriTags?: string[] | undefined;
    additionalTags?: string[] | undefined;
    additionalUriSafeAttributes?: string[] | undefined;
    allowAriaAttributes?: boolean | undefined;
    allowDataAttributes?: boolean | undefined;
    allowUnknownProtocols?: boolean | undefined;
    allowSelfcloseInAttributes?: boolean | undefined;
    allowedAttributes?: string[] | undefined;
    allowedTags?: string[] | undefined;
    allowedNamespaces?: string[] | undefined;
    allowedUriRegex?: RegExp | undefined;
    forbiddenAttributes?: string[] | undefined;
    forbiddenContents?: string[] | undefined;
    forbiddenTags?: string[] | undefined;
}

export class SanitizerService {
    private static instance: SanitizerService;

    private constructor() {
        // force singleton
    }

    private defaultConfig: Config = {
        ADD_TAGS: ['iframe', 'sf-input'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'sfref', 'contenteditable', 'target'],
        ALLOW_ARIA_ATTR: true,
        ALLOW_DATA_ATTR: true,
        ALLOW_SELF_CLOSE_IN_ATTR: true
    };

    public static getInstance(): SanitizerService {
        if (!SanitizerService.instance) {
            SanitizerService.instance = new SanitizerService();

            DOMPurify.addHook('afterSanitizeAttributes', (node) => {
                if (node.nodeName.toLowerCase() === 'iframe' && !node.hasAttribute('sandbox')) {
                    node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox');
                }
            });
        }
        return SanitizerService.instance;
    }

    public sanitizeHtml(input: string | Node, config: SanitizerConfig | null = null) {
        const newConfig = config != null ? this.parseConfig(config) : {};
        const finalConfig = Object.assign({}, this.defaultConfig, newConfig);
        return DOMPurify.sanitize(input || '', finalConfig);
    }

    public configure(config: SanitizerConfig) {
        this.defaultConfig = this.parseConfig(config);
    }

    private parseConfig(config: SanitizerConfig): Config {
        return Object.fromEntries(
            Object.entries({
                ADD_ATTR: config.additionalAtributes,
                ADD_DATA_URI_TAGS: config.additionalDataUriTags,
                ADD_TAGS: config.additionalTags,
                ADD_URI_SAFE_ATTR: config.additionalUriSafeAttributes,
                ALLOW_ARIA_ATTR: config.allowAriaAttributes,
                ALLOW_DATA_ATTR: config.allowDataAttributes,
                ALLOW_UNKNOWN_PROTOCOLS: config.allowUnknownProtocols,
                ALLOW_SELF_CLOSE_IN_ATTR: config.allowSelfcloseInAttributes,
                ALLOWED_ATTR: config.allowedAttributes,
                ALLOWED_TAGS: config.allowedTags,
                ALLOWED_NAMESPACES: config.allowedNamespaces,
                ALLOWED_URI_REGEXP: config.allowedUriRegex,
                FORBID_ATTR: config.forbiddenAttributes,
                FORBID_CONTENTS: config.forbiddenContents,
                FORBID_TAGS: config.forbiddenTags
            }).filter(([key, value]) => {
                return value != null;
            })
        );
    }
}
