import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FetchSignup } from '../features/signup/FetchSignup';
import { RtkQuerySignup } from '../features/signup/RtkQuerySignup';
import '../features/signup/signup.css';

export const SignupPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="screen-panel" aria-labelledby="signup-title">
      <h1 id="signup-title">{t('signup.title')}</h1>
      <p>{t('signup.description')}</p>
      <p><Link to="/login">{t('session.login')}</Link></p>
      <div className="signup-grid">
        <section className="forms-workspace__panel" aria-labelledby="signup-fetch-title">
          <h2 id="signup-fetch-title">{t('signup.fetch')}</h2>
          <FetchSignup />
        </section>
        <section className="forms-workspace__panel" aria-labelledby="signup-rtk-title">
          <h2 id="signup-rtk-title">{t('signup.rtkQuery')}</h2>
          <RtkQuerySignup />
        </section>
      </div>
    </section>
  );
};
