import { Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { signedIn } from '../app/store/sessionSlice';
import { useSigninMutation } from '../shared/api/serverApi';
import { useApiForm } from '../features/server/useApiForm';
import { FormField } from '../features/forms/FormField';
import { FormFeedback } from '../features/server/Feedback';

export const LoginPage = (): JSX.Element => {
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [signin] = useSigninMutation();
  const location = useLocation();
  const from: unknown = location.state?.from;
  const destination = typeof from === 'string' && /^\/(?:profile|shop|operations(?:\/new|\/[^/]+\/edit)?)(?:\?.*)?$/.test(from) ? from : '/profile';
  const form = useApiForm({ email: '', password: '' }, async (values) => {
    const { token: received } = await signin(values).unwrap();
    dispatch(signedIn(received));
  });
  if (token) return <Navigate to={destination} replace />;
  return <section className="screen-panel" aria-labelledby="login-title">
    <h1 id="login-title">{t('forms.auth.loginTitle')}</h1>
    <p>{t('server.loginDescription')}</p>
    <p><Link to="/signup">{t('signup.link')}</Link></p>
    <form className="homework-form" aria-label={t('forms.auth.loginTitle')} noValidate onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)}>
      <FormField {...form.getFieldProps('email')} label={t('forms.auth.email')} type="email" autoComplete="email" disabled={form.isSubmitting} error={form.errors.email} />
      <FormField {...form.getFieldProps('password')} label={t('forms.auth.password')} type="password" autoComplete="current-password" disabled={form.isSubmitting} error={form.errors.password} />
      <FormFeedback status={form.status} />
      <button className="ui-button" type="submit" disabled={form.isSubmitting}>{t(form.isSubmitting ? 'signup.sending' : 'forms.auth.loginSubmit')}</button>
    </form>
  </section>;
};
