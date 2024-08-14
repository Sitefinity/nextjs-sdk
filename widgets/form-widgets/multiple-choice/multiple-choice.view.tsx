import { MultipleChoiceViewProps } from './interfaces/multiple-choice.view-props';
import { MultipleChoiceClient } from './multiple-choice-client';
import { MultipleChoiceEntity } from './multiple-choice.entity';

export function MultipleChoiceDefaultView(viewProps: MultipleChoiceViewProps<MultipleChoiceEntity>) {
    const multipleChoiceUniqueId = viewProps.widgetContext.model.Properties.SfFieldName!;
    const defaultRendering = (<><script data-sf-role={`start_field_${multipleChoiceUniqueId}`} data-sf-role-field-name={`${multipleChoiceUniqueId}`} />
      <MultipleChoiceClient {...viewProps} />
      <script data-sf-role={`end_field_${multipleChoiceUniqueId}`} /></>);

    return (
      <>
        { viewProps.widgetContext.requestContext.isEdit ? <div {...viewProps.attributes}> {defaultRendering} </div>
            :defaultRendering }
      </>
    );
}
