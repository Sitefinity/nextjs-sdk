import { SubmitButtonViewProps } from './interfaces/submit-button.view-props';
import { SubmitButtonClient } from './submit-button-client';
import { SubmitButtonEntity } from './submit-button.entity';

export function SubmitButtonDefaultView(props: SubmitButtonViewProps<SubmitButtonEntity>) {
    return (
      <>
        <div {...props.attributes}>
          <SubmitButtonClient>{props.label}</SubmitButtonClient>
        </div>
      </>
    );
}
