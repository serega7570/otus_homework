import { useTranslation } from 'react-i18next';
import { FormField } from '../FormField';
import type { ProfileFormProps } from './types';

export const NameField = ({ formManager, disabled, autoFocusElement }: ProfileFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { touched, errors, submitCount, getFieldProps } = formManager;
  return <FormField {...getFieldProps('name')} label={t('forms.profile.name')} required maxLength={60} autoComplete="nickname" inputRef={autoFocusElement} disabled={disabled} error={touched.name || submitCount > 0 ? errors.name : undefined} />;
};
