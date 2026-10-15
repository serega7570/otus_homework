import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileFormProps } from './types';
import { NameField } from './NameField';
import { AboutField } from './AboutField';
import { FormActions } from '../FormActions';

// Adapted from React-js-OTUS/react-tutorial:
// client/src/features/forms/ProfileForm/ProfileForm.tsx.
// Keeps the formManager contract and NameField / AboutField composition.
export const ProfileForm = memo<ProfileFormProps>(({ className, formManager, formElement, autoFocusElement, disabled }) => {
  const { t } = useTranslation();
  const locked = disabled || formManager.isSubmitting;
  return (
    <form ref={formElement} onSubmit={formManager.handleSubmit} onChange={() => formManager.setStatus(undefined)} noValidate className={['homework-form', className].filter(Boolean).join(' ')} aria-label={t('forms.profile.title')}>
      <NameField formManager={formManager} autoFocusElement={autoFocusElement} disabled={locked} />
      <AboutField formManager={formManager} disabled={locked} />
      <FormActions label={t('forms.profile.save')} disabled={locked} status={formManager.status} />
    </form>
  );
});
ProfileForm.displayName = 'ProfileForm';
