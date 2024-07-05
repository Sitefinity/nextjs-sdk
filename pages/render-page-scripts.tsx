import { RootUrlService } from '../rest-sdk/root-url.service';
import { LayoutServiceResponse } from '../rest-sdk/dto/layout-service.response';
import { PageScript, PageScriptLocation } from '../rest-sdk/dto/scripts';
import Script from 'next/script';

const TrackingConsentDialogScriptAttributeName = 'data-sf-tracking-consent-dialog-script';
const TrackingConsentScriptAttributeName = 'data-sf-tracking-consent-script';
const InsightClientScriptUrl = 'cdn.insight.sitefinity.com/sdk/sitefinity-insight-client';

export function RenderPageScripts({ layout, scriptLocation }: { layout: LayoutServiceResponse, scriptLocation: PageScriptLocation }) {
    return (<>
      {
            layout.Scripts.filter(x => x.Location === scriptLocation).map((script, i) => {
                if (script.Source) {
                    if (script.Source[0] === '/') {
                        script.Source = RootUrlService.getClientCmsUrl() + script.Source;
                    }
                }

                const scriptAttributes = Object.fromEntries(script.Attributes.map(x => [x.Key.toLocaleLowerCase(), x.Value]));
                if (isScirptForHeadTag(script)) {
                    return RenderPageHeadScript(script, scriptAttributes, i);
                }

                return RenderPageBodyScript(script, scriptAttributes, i);
            })
        }
    </>);
}

function RenderPageHeadScript(script: PageScript, scriptAttributes: { [key: string]: string }, index: number) {
    if (script.IsNoScript) {
        return <noscript key={index} {...scriptAttributes} dangerouslySetInnerHTML={{ __html: script.Value || '' }} />;
    } else {
        if (script.Source) {
            return <Script key={index} {...scriptAttributes} src={script.Source} strategy="beforeInteractive" />;
        }

        return <Script key={index} {...scriptAttributes} dangerouslySetInnerHTML={{ __html: script.Value }} strategy="beforeInteractive" />;
    }
}

function RenderPageBodyScript(script: PageScript, scriptAttributes: { [key: string]: string }, index: number) {
    if (script.IsNoScript) {
        return <noscript key={index} {...scriptAttributes} dangerouslySetInnerHTML={{ __html: script.Value || '' }} />;
    } else {
        if (script.Source) {
            return <script key={index} {...scriptAttributes} src={script.Source} defer={true}/>;
        }

        return <script key={index} {...scriptAttributes} dangerouslySetInnerHTML={{ __html: script.Value }} defer={true}/>;
    }
}

function isScirptForHeadTag(script: PageScript): boolean {
    // HACK: The insight script cannot be placed in body tag because of nextjs error related to page hydration and
    // difference of what is rendered on the server as script tags and what the insight one additionaly adds in the HTML
    // when it loads. The link below describes the error:
    // https://nextjs.org/docs/messages/react-hydration-error
    const isInsightScript = script.Source && script.Source.includes(InsightClientScriptUrl);
    if (isInsightScript) {
        return true;
    }

    // HACK: The Tracking Consent Scripts should be loaded in the <body> instead of the <head> tag because they do not work properly otherwise
    const isTrackingConsentScript = script.Attributes.find(attr => attr.Key === TrackingConsentDialogScriptAttributeName || attr.Key === TrackingConsentScriptAttributeName);
    if (isTrackingConsentScript) {
        return false;
    }

    return script.Location === PageScriptLocation.Head;
}
