import React from 'react';
import { FormPageViewProps } from './form-page.view-props';
import { FormPageEntity } from './form-page.entity';
import { FormPageClient } from './form-page.client';
import { RenderWidgetService } from '../../../services/render-widget-service';

export function FormPageDefaultView(props: FormPageViewProps<FormPageEntity>) {

    const fieldKeys = props.children
        .map(child => child.model.Properties.SfFieldName)
        .filter(Boolean) as string[];

    return (
      <div className={`row ${props.cssClass || ''}`} {...props.attributes} data-sf-role="form-page-container" style={{ display: props.isEdit ? 'block' : 'none' }}>
        <h3 data-sf-role="form-page-title">{props.pageLabel}</h3>
        <div data-sf-role="form-page-fields" data-sfcontainer="formpage">
          {props.children.map((child) => {
                    return (<React.Fragment key={child.model.Id}>
                      {RenderWidgetService.createComponent(child.model, props.widgetContext.requestContext)}
                    </React.Fragment>);
                })}
        </div>
        <FormPageClient
          buttonLabel={props.buttonLabel}
          allowStepBackward={props.allowStepBackward}
          backLinkLabel={props.backLinkLabel}
          fieldKeys={fieldKeys}
            />
      </div>
    );
}
