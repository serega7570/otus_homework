import { useTranslation } from 'react-i18next';
import { FormField } from '../FormField';
import { FormActions } from '../FormActions';
import { useConsoleForm } from '../useConsoleForm';
import { validateAuth } from '../validation';

export type AuthMode = 'login' | 'register';
export type AuthFormValues = { email: string; password: string; confirmPassword: string };
export type AuthFormProps = Readonly<{
  mode?: AuthMode; disabled?: boolean;
  onAuthenticate?: (values: Pick<AuthFormValues, 'email'>, mode: AuthMode) => void;
}>;
const emptyAuth: AuthFormValues = { email: '', password: '', confirmPassword: '' };

const AuthFields = ({ mode, disabled, onAuthenticate }: Required<Pick<AuthFormProps, 'mode'>> & Pick<AuthFormProps, 'disabled' | 'onAuthenticate'>): JSX.Element => {
  const { t } = useTranslation();
  const form = useConsoleForm({
    label: mode === 'login' ? 'LoginForm' : 'RegistrationForm', initialValues: emptyAuth, emptyValues: emptyAuth,
    validate: (values) => validateAuth(values, mode),
    formatValues: ({ email, password }) => onAuthenticate ? { email: email.trim() } : { email: email.trim(), password },
    onValidSubmit: onAuthenticate ? ({ email }) => onAuthenticate({ email: email.trim() }, mode) : undefined,
  });
  const error = (field: keyof AuthFormValues): string | undefined => form.touched[field] || form.submitCount > 0 ? form.errors[field] : undefined;
  const locked = disabled || form.isSubmitting;
  return (
    <form className="homework-form" noValidate onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)} aria-label={t(`forms.auth.${mode}Title`)}>
      <FormField {...form.getFieldProps('email')} label={t('forms.auth.email')} type="email" required autoComplete="email" maxLength={254} disabled={locked} error={error('email')} />
      <FormField {...form.getFieldProps('password')} label={t('forms.auth.password')} type="password" required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} maxLength={128} hint={t(`forms.auth.${mode}PasswordHint`)} disabled={locked} error={error('password')} />
      {mode === 'register' && <FormField {...form.getFieldProps('confirmPassword')} label={t('forms.auth.confirmPassword')} type="password" required autoComplete="new-password" maxLength={128} disabled={locked} error={error('confirmPassword')} />}
      <FormActions label={t(`forms.auth.${mode}Submit`)} disabled={locked} status={form.status} />
    </form>
  );
};

export const AuthForm = ({ mode = 'login', disabled, onAuthenticate }: AuthFormProps): JSX.Element => <AuthFields key={mode} mode={mode} disabled={disabled} onAuthenticate={onAuthenticate} />;
