/** @jest-environment ./src/test/FetchEnvironment.cjs */
import '@testing-library/jest-dom';
import { StrictMode } from 'react';
import { act, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './App';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { StoreProvider } from './store/StoreProvider';
import { createAppStore } from './store/store';
import { appInitialized, tokenReceived } from './store/sessionSlice';
import { TOKEN_STORAGE_KEY } from './store/tokenStorage';
import { createMockServer, errorResponse } from '../test/mockServer';
import { serverApi } from '../shared/api/serverApi';

const Url = () => <output aria-label="URL">{useLocation().pathname}</output>;
const nativeFetch = globalThis.fetch;
let backend: ReturnType<typeof createMockServer>;
const stores: ReturnType<typeof createAppStore>[] = [];
beforeEach(() => { localStorage.clear(); backend = createMockServer(); globalThis.fetch = backend.fetch; });
afterEach(() => { for (const store of stores.splice(0)) store.dispatch(serverApi.util.resetApiState()); globalThis.fetch = nativeFetch; localStorage.clear(); });
const renderSession = (route: string, token: string | null = null, syncTabs = false) => {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  const store = createAppStore(localStorage); stores.push(store);
  store.dispatch(appInitialized(token));
  render(<StrictMode><ThemeProvider><LanguageProvider><StoreProvider store={store} syncTabs={syncTabs}>
    <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Url /><AppRoutes /></MemoryRouter>
  </StoreProvider></LanguageProvider></ThemeProvider></StrictMode>);
  return store;
};
const login = async (password = 'password8') => {
  const user = userEvent.setup();
  const form = within(await screen.findByRole('form', { name: 'Вход' }));
  await user.type(form.getByLabelText('Email'), 'user@example.com');
  await user.type(form.getByLabelText('Пароль'), password);
  await user.click(form.getByRole('button', { name: 'Войти' }));
};
it.each(['/profile', '/operations', '/operations/new', '/shop'])('authenticates on the server and returns to %s', async (route) => {
  const store = renderSession(route);
  expect(await screen.findByRole('form', { name: 'Вход' })).toBeInTheDocument();
  await login();
  await waitFor(() => expect(screen.getByLabelText('URL')).toHaveTextContent(new RegExp(`^${route}$`)));
  expect(store.getState().auth.profile?.email).toBe('user@example.com');
  expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('server-token');
  expect(JSON.stringify(store.getState())).not.toMatch(/password8|SECRET_HASH/);
});
it('renders server credential errors and permits retry without navigating', async () => {
  const store = renderSession('/login');
  await login('wrong');
  expect(await screen.findByRole('alert')).toHaveTextContent('Неверный email или пароль.');
  expect(store.getState().auth.token).toBeNull();
  const user = userEvent.setup();
  await user.clear(screen.getByLabelText('Пароль'));
  await user.type(screen.getByLabelText('Пароль'), 'password8');
  await user.click(screen.getByRole('button', { name: 'Войти' }));
  expect(await screen.findByRole('heading', { name: 'Профиль', level: 1 })).toBeInTheDocument();
});
it('restores a real profile and clears an expired token even when the API returns status 400', async () => {
  const store = renderSession('/profile', 'expired-token');
  expect(await screen.findByRole('form', { name: 'Вход' })).toBeInTheDocument();
  expect(store.getState().auth).toEqual({ initialized: true, token: null, profile: null });
  expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
});
it('keeps a stored token after a network failure and offers profile verification retry', async () => {
  backend.overrides.set('GET profile', () => { throw new TypeError('Offline'); });
  const store = renderSession('/profile', 'server-token');
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось связаться с сервером.');
  expect(store.getState().auth.token).toBe('server-token');
  backend.overrides.delete('GET profile');
  await userEvent.setup().click(screen.getByRole('button', { name: 'Повторить' }));
  expect(await screen.findByRole('textbox', { name: 'Имя' })).toHaveValue('Анна');
});
it('saves the profile through PUT and restores the server name after remount', async () => {
  renderSession('/profile', 'server-token');
  const user = userEvent.setup();
  const name = await screen.findByRole('textbox', { name: 'Имя' });
  await user.clear(name); await user.type(name, 'maria_otus');
  await user.click(screen.getByRole('button', { name: 'Сохранить профиль' }));
  expect(await screen.findByText('Изменения сохранены на сервере.')).toBeInTheDocument();
  expect(backend.state.profile.name).toBe('maria_otus');
  const request = backend.requests.find((r) => r.method === 'PUT' && r.url.endsWith('/profile'))!;
  expect(await request.json()).toEqual({ name: 'maria_otus' });
  const navigation = within(screen.getByRole('navigation'));
  await user.click(navigation.getByRole('link', { name: 'Операции' }));
  await user.click(navigation.getByRole('link', { name: 'Профиль' }));
  expect(await screen.findByRole('textbox', { name: 'Имя' })).toHaveValue('maria_otus');
});
it('preserves profile input and displays a server field validation error', async () => {
  backend.overrides.set('PUT profile', () => errorResponse('ERR_VALIDATION_ERROR', '"Анна" is not valid nickname'));
  renderSession('/profile', 'server-token');
  const user = userEvent.setup();
  const name = await screen.findByRole('textbox', { name: 'Имя' });
  await user.click(screen.getByRole('button', { name: 'Сохранить профиль' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Имя: от 7 символов.');
  expect(name).toHaveValue('Анна');
  expect(name).toHaveAttribute('aria-invalid', 'true');
});
it('logs out and removes private API cache and credentials', async () => {
  const store = renderSession('/operations', 'server-token');
  await screen.findByRole('heading', { name: 'Операция 1' });
  await userEvent.setup().click(screen.getByRole('button', { name: 'Выйти' }));
  expect(await screen.findByRole('form', { name: 'Вход' })).toBeInTheDocument();
  expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  expect(JSON.stringify(store.getState())).not.toContain('Операция 1');
});
it('clears a private modal on cross-tab logout and verifies a replacement token', async () => {
  const store = renderSession('/operations/new', 'server-token', true);
  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  act(() => { localStorage.removeItem(TOKEN_STORAGE_KEY); window.dispatchEvent(new StorageEvent('storage', { key: TOKEN_STORAGE_KEY, storageArea: localStorage })); });
  expect(await screen.findByRole('form', { name: 'Вход' })).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
  act(() => { store.dispatch(tokenReceived('second-token')); });
  await waitFor(() => expect(store.getState().auth.profile?.email).toBe('second@example.com'));
});
