import { classNames } from '../../../editor/utils/classNames';
import { htmlAttributes } from '../../../editor/widget-framework/attributes';
import { WidgetContext } from '../../../editor/widget-framework/widget-context';
import { SubmitButtonClient } from './submit-button-client';
import { SubmitButtonEntity } from './submit-button.entity';

export function SubmitButton(props: WidgetContext<SubmitButtonEntity>) {
    const entity = props.model.Properties;

    const dataAttributes = htmlAttributes(props);
    return (
      <div {...dataAttributes} className={classNames('mb-3', entity.CssClass)} data-sf-role="submit-button-container">
        <SubmitButtonClient>{entity.Label}</SubmitButtonClient>
      </div>
    );
}
