import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { StoreProvider } from './store/StoreProvider';
import { useAppSelector } from './store/hooks';
import { RequireAuth } from './RequireAuth';
import { AppLayout } from './AppLayout';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { OperationsPage } from '../pages/OperationsPage';
import { OperationModal } from '../pages/OperationModal';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ExamplesPage } from '../pages/ExamplesPage';
import { LoginPage } from '../pages/LoginPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { SignupPage } from '../pages/SignupPage';
import { ShopPage } from '../pages/ShopPage';
import { ServerSession } from './ServerSession';
import '../features/server/server.css';

export const AppRoutes = (): JSX.Element => {
  const initialized = useAppSelector((state) => state.auth.initialized);
  const { t } = useTranslation();
  if (!initialized) return <p role="status">{t('session.loading')}</p>;
  return (
    <ServerSession><Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<RequireAuth />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="operations" element={<OperationsPage />}>
            <Route path="new" element={<OperationModal mode="create" />} />
            <Route path=":id/edit" element={<OperationModal mode="edit" />} />
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forms" element={<Navigate to="/login" replace />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="discounts" element={<ExamplesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes></ServerSession>
  );
};

export const App = (): JSX.Element => (
  <ThemeProvider initialTheme="dark">
    <LanguageProvider>
      <StoreProvider>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </HashRouter>
      </StoreProvider>
    </LanguageProvider>
  </ThemeProvider>
);
