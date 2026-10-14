/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { StrictMode } from 'react';
import { act, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './App';
import { StoreProvider } from './store/StoreProvider';
import { createAppStore } from './store/store';
import { appInitialized, createDemoToken, signedOut } from './store/sessionSlice';
import { TOKEN_STORAGE_KEY } from './store/tokenStorage';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';

const CurrentUrl = () => <output aria-label="Current URL">{useLocation().pathname}</output>;
const renderSession = (route: string, token: string | null = null, syncTabs = false) => {
  const store = createAppStore(localStorage);
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  store.dispatch(appInitialized(token));
  const rendered = render(
    <ThemeProvider><LanguageProvider><StoreProvider store={store} syncTabs={syncTabs}>
      <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CurrentUrl /><AppRoutes />
      </MemoryRouter>
    </StoreProvider></LanguageProvider></ThemeProvider>,
  );
  return { ...rendered, store };
};

describe('authentication and protected routes', () => {
  let log: jest.SpyInstance;
  beforeEach(() => { localStorage.clear(); log = jest.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => { log.mockRestore(); localStorage.clear(); });
  const adminToken = () => createDemoToken('admin@example.com', 'login');

  it('redirects guests from profile to login, validates credentials and returns to profile after login', async () => {
    const user = userEvent.setup();
    const { store } = renderSession('/profile');
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('/login');
    expect(screen.queryByRole('form', { name: 'Редактирование профиля' })).not.toBeInTheDocument();
    const form = within(screen.getByRole('form', { name: 'Вход' }));
    await user.click(form.getByRole('button', { name: 'Войти' }));
    expect(await form.findAllByRole('alert')).toHaveLength(2);
    expect(store.getState().auth.token).toBeNull();
    await user.type(form.getByRole('textbox', { name: 'Email' }), 'user@example.com');
    await user.type(form.getByLabelText(/Пароль/), 'password8');
    await user.click(form.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByRole('heading', { name: 'Профиль', level: 1 })).toBeInTheDocument();
    expect(store.getState().auth.profile?.role).toBe('user');
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(store.getState().auth.token);
    expect(log).toHaveBeenCalledWith('LoginForm', { email: 'user@example.com' });
    expect(JSON.stringify(store.getState())).not.toContain('password8');
  });

  it.each(['/operations/new', '/operations/groceries/edit'])('returns an administrator to the requested modal after sign-in: %s', async (route) => {
    const user = userEvent.setup();
    const { store } = renderSession(route);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const form = within(screen.getByRole('form', { name: 'Вход' }));
    await user.type(form.getByRole('textbox', { name: 'Email' }), 'admin@example.com');
    await user.type(form.getByLabelText(/Пароль/), 'password8');
    await user.click(form.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Current URL')).toHaveTextContent(route);
    expect(store.getState().auth.profile?.role).toBe('admin');
  });

  it('allows public reading but hides create/edit controls from guests', () => {
    renderSession('/operations');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Добавить операцию' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^Редактировать:/ })).not.toBeInTheDocument();
  });

  it.each(['/operations/new', '/operations/groceries/edit'])('denies a regular user the direct administrator route: %s', (route) => {
    renderSession(route, createDemoToken('user@example.com', 'login'));
    expect(screen.getByRole('heading', { name: 'Доступ запрещён' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('/forbidden');
  });

  it('registers a regular user even with the administrator email', async () => {
    const user = userEvent.setup();
    const { store } = renderSession('/login');
    await user.click(within(screen.getByRole('group', { name: 'Режим авторизации' })).getByRole('button', { name: 'Регистрация' }));
    const form = within(screen.getByRole('form', { name: 'Регистрация' }));
    await user.type(form.getByRole('textbox', { name: 'Email' }), 'admin@example.com');
    await user.type(form.getByLabelText(/^Пароль/), 'password8');
    await user.type(form.getByLabelText(/^Повторите пароль/), 'password8');
    await user.click(form.getByRole('button', { name: 'Зарегистрироваться' }));
    expect(await screen.findByRole('heading', { name: 'Профиль', level: 1 })).toBeInTheDocument();
    expect(store.getState().auth.profile?.role).toBe('user');
    expect(log).toHaveBeenCalledWith('RegistrationForm', { email: 'admin@example.com' });
  });

  it('stores profile edits and displays them on returning to the profile screen', async () => {
    const user = userEvent.setup();
    const { store } = renderSession('/profile', 'regular-token');
    const name = screen.getByRole('textbox', { name: 'Имя' });
    await user.clear(name);
    await user.type(name, 'Анна');
    await user.click(screen.getByRole('button', { name: 'Сохранить профиль' }));
    await waitFor(() => expect(store.getState().auth.profile?.name).toBe('Анна'));
    const navigation = within(screen.getByRole('navigation'));
    await user.click(navigation.getByRole('link', { name: 'Операции' }));
    await user.click(navigation.getByRole('link', { name: 'Профиль' }));
    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveValue('Анна');
    expect(store.getState().auth.profile?.role).toBe('user');
  });

  it('logs out, clears storage and removes protected profile data immediately', async () => {
    const user = userEvent.setup();
    const { store } = renderSession('/profile', adminToken());
    await user.click(screen.getByRole('button', { name: 'Выйти' }));
    expect(screen.getByRole('form', { name: 'Вход' })).toBeInTheDocument();
    expect(store.getState().auth).toMatchObject({ token: null, profile: null, initialized: true });
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('removes an open portal and denies access when another tab changes the admin session to a user', async () => {
    const { store } = renderSession('/operations/groceries/edit', adminToken(), true);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const nextToken = createDemoToken('user@example.com', 'login');
    act(() => {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      window.dispatchEvent(new StorageEvent('storage', { key: TOKEN_STORAGE_KEY, newValue: nextToken, storageArea: localStorage }));
    });
    expect(await screen.findByRole('heading', { name: 'Доступ запрещён' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(store.getState().auth.profile?.role).toBe('user');
    expect(store.getState().auth.token).toBe(nextToken);
  });

  it('redirects a protected profile when the token is cleared in another tab', async () => {
    const { store } = renderSession('/profile', adminToken(), true);
    act(() => {
      localStorage.clear();
      window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: localStorage }));
    });
    expect(await screen.findByRole('form', { name: 'Вход' })).toBeInTheDocument();
    expect(store.getState().auth.profile).toBeNull();
  });

  it('initializes once in StrictMode and restores a persisted administrator before checking routes', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, adminToken());
    const store = createAppStore(localStorage);
    let initializationTransitions = 0;
    let previouslyInitialized = false;
    const unsubscribe = store.subscribe(() => {
      if (!previouslyInitialized && store.getState().auth.initialized) initializationTransitions += 1;
      previouslyInitialized = store.getState().auth.initialized;
    });
    render(<StrictMode><ThemeProvider><LanguageProvider><StoreProvider store={store}>
      <MemoryRouter initialEntries={['/operations/new']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppRoutes /></MemoryRouter>
    </StoreProvider></LanguageProvider></ThemeProvider></StrictMode>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(initializationTransitions).toBe(1);
    act(() => { store.dispatch(signedOut()); });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Вход' })).toBeInTheDocument();
    expect(initializationTransitions).toBe(1);
    unsubscribe();
  });
});
