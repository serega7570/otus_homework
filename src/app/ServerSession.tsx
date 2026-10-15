import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { profileReceived, signedOut } from './store/sessionSlice';
import { useProfileQuery } from '../shared/api/serverApi';
import { ApiError } from '../features/server/Feedback';

export const ServerSession = ({ children }: { children: ReactNode }): JSX.Element => {
  const { token, profile, initialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const query = useProfileQuery(token ?? '', { skip: !token || !initialized });
  useEffect(() => {
    if (token && query.currentData) dispatch(profileReceived({ token, profile: query.currentData }));
  }, [token, query.currentData, dispatch]);
  if (!initialized || (token && !profile && !query.error)) return <p role="status">{t('session.loading')}</p>;
  if (token && !profile && query.error) return <section className="screen-panel">
    <ApiError error={query.error} retry={() => { void query.refetch(); }} />
    <button className="ui-button" type="button" onClick={() => dispatch(signedOut())}>{t('session.logout')}</button>
  </section>;
  // Remount private form state immediately when another tab changes the account.
  return <div key={token ?? 'guest'}>{children}</div>;
};
