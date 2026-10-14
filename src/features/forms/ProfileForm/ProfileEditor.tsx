import { useConsoleForm } from '../useConsoleForm';
import { validateProfile } from '../validation';
import { ProfileForm } from './ProfileForm';
import { emptyProfile, type ProfileFormValues } from './types';

export type ProfileEditorProps = Readonly<{ initialValues?: ProfileFormValues; disabled?: boolean; onSave?: (profile: ProfileFormValues) => void }>;

export const ProfileEditor = ({ initialValues = emptyProfile, disabled, onSave }: ProfileEditorProps): JSX.Element => {
  const formManager = useConsoleForm({
    label: 'ProfileForm', initialValues, emptyValues: emptyProfile, validate: validateProfile,
    formatValues: (values) => ({ name: values.name.trim(), about: values.about.trim() }),
    onValidSubmit: onSave ? (values) => onSave({ name: values.name.trim(), about: values.about.trim() }) : undefined,
  });
  return <ProfileForm formManager={formManager} disabled={disabled} />;
};
