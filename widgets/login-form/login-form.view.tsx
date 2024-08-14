import { VisibilityStyle } from '../styling/visibility-style';
import { LoginFormViewProps } from './interfaces/login-form.view-props';
import { LoginFormClient } from './login-form.client';
import { LoginFormEntity } from './login-form.entity';

export function LoginFormDefaultView(props: LoginFormViewProps<LoginFormEntity>) {
  return (
    <>
      <div
        data-sf-invalid={props.invalidClass}
        data-sf-role="sf-login-form-container"
        data-sf-visibility-hidden={props.visibilityClasses[VisibilityStyle.Hidden]}
        {...props.attributes}>
        <LoginFormClient {...props} />
      </div>
    </>
  );
}
