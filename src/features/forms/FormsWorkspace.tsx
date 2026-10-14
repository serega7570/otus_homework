import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileEditor } from './ProfileForm/ProfileEditor';
import { OperationForm } from './OperationForm/OperationForm';
import { AuthForm, type AuthMode } from './AuthForm/AuthForm';
import { sampleOperation, sampleProfile } from './samples';

export const FormsWorkspace = (): JSX.Element => {
  const { t } = useTranslation();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [operationMode, setOperationMode] = useState<'create' | 'edit'>('create');
  return (
    <div className="forms-workspace">
      <article className="forms-workspace__panel">
        <h3>{t('forms.auth.title')}</h3>
        <div className="forms-workspace__switch" role="group" aria-label={t('forms.auth.mode')}>
          {(['login', 'register'] as const).map((mode) => <button key={mode} type="button" aria-pressed={authMode === mode} onClick={() => setAuthMode(mode)}>{t(`forms.auth.${mode}Title`)}</button>)}
        </div>
        <AuthForm mode={authMode} />
      </article>
      <article className="forms-workspace__panel">
        <h3>{t('forms.profile.title')}</h3>
        <ProfileEditor initialValues={sampleProfile} />
      </article>
      <article className="forms-workspace__panel">
        <h3>{t('forms.operation.title')}</h3>
        <div className="forms-workspace__switch" role="group" aria-label={t('forms.operation.mode')}>
          {(['create', 'edit'] as const).map((mode) => <button key={mode} type="button" aria-pressed={operationMode === mode} onClick={() => setOperationMode(mode)}>{t(`forms.operation.${mode}Title`)}</button>)}
        </div>
        <OperationForm key={operationMode} mode={operationMode} initialValues={operationMode === 'edit' ? sampleOperation : undefined} />
      </article>
    </div>
  );
};
