import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from './store/hooks';

export const RequireAuth = ({ adminOnly = false }: { adminOnly?: boolean }): JSX.Element => {
  const { token, profile } = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/forbidden" replace />;
  return <Outlet />;
};
