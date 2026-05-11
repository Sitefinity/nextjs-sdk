import { FormNavigationViewProps } from './form-navigation.view-props';
import { FormNavigationEntity } from './form-navigation.entity';
import { FormNavigationClient } from './form-navigation.client';

export function FormNavigationDefaultView(props: FormNavigationViewProps<FormNavigationEntity>) {
    return (
      <div className={`mb-3 ${props.cssClass || ''}`} {...props.attributes} data-sf-role="form-navigation-container">
        <FormNavigationClient navigationSteps={props.navigationSteps} />
      </div>
    );
}
