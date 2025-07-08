import { RegistrationEntity } from '../registration.entity';
import { RegistrationViewProps } from './registration.view-props';

export interface RegistrationFormProps {
    action: string;
    viewProps: RegistrationViewProps<RegistrationEntity>;
}
