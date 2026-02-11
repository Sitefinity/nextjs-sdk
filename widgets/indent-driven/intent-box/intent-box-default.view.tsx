import { ViewPropsBase } from '../../common/view-props-base';
import { IntentBoxClient } from './intent-box.client';
import { IntentBoxEntity } from './intent-box.entity';

export interface IntentBoxViewProps extends ViewPropsBase<IntentBoxEntity> {
    labelText: string;
    placeholder: string;
    submitButtonTooltip: string;
    containerCss: string;
    pageUrl: string;
    inputId: string;
    suggestions?: string[];
    suggestionsLabel?: string;
}

export function IntentBoxDefaultView(props: IntentBoxViewProps) {
    const { attributes, labelText, placeholder, submitButtonTooltip, containerCss, pageUrl, inputId, suggestions, suggestionsLabel } = props;

    return (<div {...attributes} className={`sf-intent-box row ${containerCss}`}>
      {labelText && <h2 className="mt-4 mb-4 text-center">{labelText}</h2>}
      <IntentBoxClient
        targetPageUrl={pageUrl}
        placeholder={placeholder}
        inputId={inputId}
        submitButtonTooltip={submitButtonTooltip}
        suggestions={suggestions || []}
        suggestionsLabel={suggestionsLabel}
          />
    </div>);
}
