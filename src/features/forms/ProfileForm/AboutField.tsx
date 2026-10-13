import { useTranslation } from 'react-i18next';
import { FormField } from '../FormField';
import type { ProfileFormProps } from './types';

export const AboutField = ({ formManager, disabled }: ProfileFormProps): JSX.Element => {
  const { t } = useTranslation();
  const { touched, errors, submitCount, getFieldProps } = formManager;
  return <FormField {...getFieldProps('about')} label={t('forms.profile.about')} multiline maxLength={500} hint={t('forms.profile.aboutHint')} disabled={disabled} error={touched.about || submitCount > 0 ? errors.about : undefined} />;
};
