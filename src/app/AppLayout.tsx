import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '../shared/ui';

export const AppLayout = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <Header brand="OTUS · React" navigationContent={
        <>
          <NavLink to="/" end>{t('navigation.overview')}</NavLink>
          <NavLink to="/profile">{t('routing.profile')}</NavLink>
          <NavLink to="/operations">{t('navigation.operations')}</NavLink>
          <NavLink to="/forms">{t('forms.title')}</NavLink>
          <NavLink to="/discounts">{t('discounts.title')}</NavLink>
        </>
      } />
      <main className="page">
        <div className="glow glow--top" aria-hidden="true" />
        <div className="glow glow--bottom" aria-hidden="true" />
        <Outlet />
        <footer className="footer">
          <p>{t('home.footer')}</p>
          <a href="https://github.com/serega7570" target="_blank" rel="noreferrer">GitHub ↗</a>
        </footer>
      </main>
    </>
  );
};
