import { ViewPropsBase } from '../../common/view-props-base';
import { IntentDrivenContentClient } from './intent-driven-content.client';
import { IntentDrivenContentEntity, NoIntentAction, SectionDto } from './intent-driven-content.entity';

export interface IntentDrivenContentViewProps extends ViewPropsBase<IntentDrivenContentEntity> {
    defaultQuery: string | null;
    language: string;
    noIntentAction: NoIntentAction;
    siteId: string;
    pageId: string;
    sections: SectionDto[];
    isEdit: boolean;
}

export function IntentDrivenContentDefaultView(props: IntentDrivenContentViewProps) {
  return (<div {...props.attributes}>
    <IntentDrivenContentClient
      defaultQuery={props.defaultQuery}
      language={props.language}
      noIntentAction={props.noIntentAction}
      siteId={props.siteId}
      pageId={props.pageId}
      sections={props.sections}
      isEdit={props.isEdit} />
  </div>);
}
