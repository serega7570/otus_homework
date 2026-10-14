import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthForm, type AuthMode } from '../features/forms/AuthForm/AuthForm';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { signIn } from '../app/store/thunks';

export const LoginPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const from: unknown = location.state?.from;
  const destination = typeof from === 'string' && /^\/(?:profile|operations(?:\/new|\/[^/]+\/edit)?)(?:\?.*)?$/.test(from) ? from : '/profile';
  if (token) return <Navigate to={destination} replace />;
  return (
    <section className="screen-panel" aria-labelledby="login-title">
      <h1 id="login-title">{t(`forms.auth.${mode}Title`)}</h1>
      <p>{t('session.loginDescription')}</p>
      <div className="forms-workspace__switch" role="group" aria-label={t('forms.auth.mode')}>
        {(['login', 'register'] as const).map((item) => (
          <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>{t(`forms.auth.${item}Title`)}</button>
        ))}
      </div>
      <AuthForm mode={mode} onAuthenticate={({ email }, authMode) => {
        dispatch(signIn(email, authMode));
        navigate(destination, { replace: true });
      }} />
    </section>
  );
};
