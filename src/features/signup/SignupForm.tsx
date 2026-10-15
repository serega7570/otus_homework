import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '../forms/FormField';
import { getSignupErrors } from './signupErrors';
import type { SignupValues } from './signupApi';

type SignupFormProps = {
  label: string;
  pending: boolean;
  success: boolean;
  error?: unknown;
  onSubmit: (values: SignupValues) => Promise<void>;
  onEdit: () => void;
};

export const SignupForm = ({ label, pending, success, error, onSubmit, onEdit }: SignupFormProps): JSX.Element => {
  const { t } = useTranslation();
  const [values, setValues] = useState<SignupValues>({ email: '', password: '' });
  useEffect(() => {
    if (success) setValues((current) => ({ ...current, password: '' }));
  }, [success]);
  const errors = error ? getSignupErrors(error) : undefined;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    await onSubmit(values);
  };
  return (
    <form className="homework-form" aria-label={label} aria-busy={pending} noValidate onSubmit={submit}>
      <FormField label={t('forms.auth.email')} name="email" type="email" autoComplete="email"
        value={values.email} disabled={pending} error={errors?.fields.email} onBlur={() => {}}
        onChange={(event) => { setValues({ ...values, email: event.target.value }); onEdit(); }} />
      <FormField label={t('forms.auth.password')} name="password" type="password" autoComplete="new-password"
        value={values.password} disabled={pending} error={errors?.fields.password} onBlur={() => {}}
        onChange={(event) => { setValues({ ...values, password: event.target.value }); onEdit(); }} />
      {errors?.general.map((message) => <p className="form-field__error" role="alert" key={message}>{t(message)}</p>)}
      <div className="homework-form__actions">
        <button className="ui-button ui-button--primary" type="submit" disabled={pending}>
          {t(pending ? 'signup.sending' : 'forms.auth.registerSubmit')}
        </button>
        {success && <p className="homework-form__status" role="status">{t('signup.success')}</p>}
      </div>
    </form>
  );
};
