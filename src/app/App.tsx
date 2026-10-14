import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { OperationsProvider } from './OperationsProvider';
import { AppLayout } from './AppLayout';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { OperationsPage } from '../pages/OperationsPage';
import { OperationModal } from '../pages/OperationModal';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ExamplesPage } from '../pages/ExamplesPage';

export const AppRoutes = (): JSX.Element => (
  <OperationsProvider>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="operations" element={<OperationsPage />}>
          <Route path="new" element={<OperationModal mode="create" />} />
          <Route path=":id/edit" element={<OperationModal mode="edit" />} />
        </Route>
        <Route path="forms" element={<ExamplesPage section="forms" />} />
        <Route path="discounts" element={<ExamplesPage section="discounts" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </OperationsProvider>
);

export const App = (): JSX.Element => (
  <ThemeProvider initialTheme="dark">
    <LanguageProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </HashRouter>
    </LanguageProvider>
  </ThemeProvider>
);
