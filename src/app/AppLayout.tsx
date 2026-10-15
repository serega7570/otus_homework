import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '../shared/ui';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { signedOut } from './store/sessionSlice';

export const AppLayout = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.profile);
  return (
    <>
      <Header brand="OTUS · React" userLabel={profile?.name} userInitial={profile?.name.slice(0, 1)} actions={
        profile ? <>
          <button className="ui-switcher" type="button" onClick={() => dispatch(signedOut())}>{t('session.logout')}</button>
        </> : <NavLink className="ui-switcher" to="/login">{t('session.login')}</NavLink>
      } navigationContent={
        <>
          <NavLink to="/" end>{t('navigation.overview')}</NavLink>
          <NavLink to="/profile">{t('routing.profile')}</NavLink>
          <NavLink to="/operations">{t('navigation.operations')}</NavLink>
          <NavLink to="/shop">{t('server.shop.title')}</NavLink>
          <NavLink to="/discounts">{t('discounts.title')}</NavLink>
          <NavLink to="/signup">{t('signup.title')}</NavLink>
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
