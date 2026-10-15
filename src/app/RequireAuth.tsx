import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from './store/hooks';

export const RequireAuth = (): JSX.Element => {
  const { token, profile } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!token || !profile) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
};
