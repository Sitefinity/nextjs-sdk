import { ChangePasswordFormClient } from './change-password-form.client';
import { ChangePasswordEntity } from './change-password.entity';
import { ChangePasswordViewProps } from './interfaces/change-password.view-props';

export function ChangePasswordDefaultView(props: ChangePasswordViewProps<ChangePasswordEntity>) {

    return (
      <>
        <div
          {...props.attributes}
            >
          {
            <>
              <ChangePasswordFormClient {...props} />
            </>
            }
        </div>
      </>
    );
}
