/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { AppRoutes } from './App';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { StoreProvider } from './store/StoreProvider';
import { createAppStore } from './store/store';
import { appInitialized, createDemoToken } from './store/sessionSlice';

const HistoryControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return <><output aria-label="URL">{location.pathname}</output><button onClick={() => navigate(-1)}>Back</button><button onClick={() => navigate(1)}>Forward</button></>;
};

const renderRoute = (route = '/') => {
  const store = createAppStore();
  store.dispatch(appInitialized(createDemoToken('admin@example.com', 'login')));
  return render(
    <ThemeProvider initialTheme="dark"><LanguageProvider>
      <StoreProvider store={store} syncTabs={false}>
        <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <HistoryControls /><AppRoutes />
        </MemoryRouter>
      </StoreProvider>
    </LanguageProvider></ThemeProvider>,
  );
};

describe('application routing', () => {
  let log: jest.SpyInstance;
  beforeEach(() => { log = jest.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => { log.mockRestore(); });

  it('navigates between all header screens and marks only the current screen active', async () => {
    const user = userEvent.setup();
    renderRoute();
    const navigation = within(screen.getByRole('navigation'));
    for (const [link, heading, url] of [
      ['Профиль', 'Профиль', '/profile'],
      ['Операции', 'Доходы и расходы', '/operations'],
      ['Скидки пользователей', 'Скидки пользователей', '/discounts'],
      ['Обзор', 'Сергей', '/'],
    ]) {
      await user.click(navigation.getByRole('link', { name: link }));
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
      expect(screen.getByLabelText('URL')).toHaveTextContent(url);
      expect(navigation.getByRole('link', { name: link })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('navigation').querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    }
  });

  it('opens a profile URL directly, validates and submits the existing profile form', async () => {
    const user = userEvent.setup();
    renderRoute('/profile');
    const name = screen.getByRole('textbox', { name: 'Имя' });
    const submit = screen.getByRole('button', { name: 'Сохранить профиль' });
    expect(name).toHaveValue('Сергей');
    await user.clear(name);
    await user.click(submit);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(log).not.toHaveBeenCalled();
    await user.type(name, 'Анна');
    await user.click(submit);
    await waitFor(() => expect(log).toHaveBeenCalledWith('ProfileForm', expect.objectContaining({ name: 'Анна' })));
    expect(name).toHaveValue('Анна');
  });

  it('uses URL history to mount and unmount the create portal, including back and forward', async () => {
    const user = userEvent.setup();
    const { container } = renderRoute('/operations');
    await user.click(screen.getByRole('link', { name: 'Добавить операцию' }));
    const dialog = screen.getByRole('dialog');
    expect(screen.getByLabelText('URL')).toHaveTextContent('/operations/new');
    expect(dialog.parentElement?.parentElement).toBe(document.body);
    expect(container).not.toContainElement(dialog);
    expect(document.body.style.overflow).toBe('hidden');
    expect(within(screen.getByRole('navigation')).getByRole('link', { name: 'Операции' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Forward' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText('URL')).toHaveTextContent(/^\/operations$/);
    expect(document.body.style.overflow).toBe('');
  });

  it('validates creation, adds a valid operation and keeps it across screen navigation', async () => {
    const user = userEvent.setup();
    renderRoute('/operations/new');
    const dialog = within(screen.getByRole('dialog'));
    await user.click(dialog.getByRole('button', { name: 'Добавить операцию' }));
    expect(await dialog.findAllByRole('alert')).not.toHaveLength(0);
    expect(log).not.toHaveBeenCalled();
    await user.type(dialog.getByRole('textbox', { name: 'Название операции' }), 'Новая покупка');
    await user.type(dialog.getByRole('spinbutton', { name: 'Сумма, ₽' }), '123.45');
    await user.selectOptions(dialog.getByRole('combobox', { name: 'Категория' }), 'food');
    await user.type(dialog.getByLabelText(/Дата/), '2026-10-14');
    await user.click(dialog.getByRole('button', { name: 'Добавить операцию' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Новая покупка' })).toBeInTheDocument();
    expect(log).toHaveBeenCalledWith('OperationForm', expect.objectContaining({ mode: 'create', amount: 123.45 }));
    const navigation = within(screen.getByRole('navigation'));
    await user.click(navigation.getByRole('link', { name: 'Профиль' }));
    await user.click(navigation.getByRole('link', { name: 'Операции' }));
    expect(screen.getByRole('heading', { name: 'Новая покупка' })).toBeInTheDocument();
  });

  it('fills a direct edit URL, updates the same operation and closes to the list', async () => {
    const user = userEvent.setup();
    renderRoute('/operations/groceries/edit');
    const dialog = within(screen.getByRole('dialog'));
    const name = dialog.getByRole('textbox', { name: 'Название операции' });
    expect(name).toHaveValue('Продукты на неделю');
    expect(dialog.getByRole('spinbutton')).toHaveValue(2400);
    await user.clear(name);
    await user.type(name, 'Продукты на месяц');
    await user.click(dialog.getByRole('button', { name: 'Сохранить операцию' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('list')).toContainElement(screen.getByRole('heading', { name: 'Продукты на месяц' }));
    expect(screen.queryByRole('heading', { name: 'Продукты на неделю' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByLabelText('URL')).toHaveTextContent(/^\/operations$/);
  });

  it('cancels an edit without changing data, and preserves theme and language inside the portal', async () => {
    const user = userEvent.setup();
    renderRoute('/operations');
    await user.click(screen.getByRole('link', { name: 'Редактировать: Продукты на неделю' }));
    const name = within(screen.getByRole('dialog')).getByRole('textbox', { name: 'Название операции' });
    await user.clear(name);
    await user.type(name, 'Не сохранять');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Язык интерфейса' }), 'en');
    await user.click(screen.getByRole('button', { name: 'Toggle color theme' }));
    expect(screen.getByRole('dialog', { name: 'Edit operation' }).parentElement).toHaveAttribute('data-theme', 'light');
    expect(name).toHaveValue('Не сохранять');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('heading', { name: 'Продукты на неделю' })).toBeInTheDocument();
    expect(log).not.toHaveBeenCalled();
  });

  it('handles a missing operation and closes a directly opened modal without leaving the app', async () => {
    const user = userEvent.setup();
    renderRoute('/operations/missing/edit');
    expect(screen.getByRole('dialog', { name: 'Операция не найдена' })).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Доходы и расходы' })).toBeInTheDocument();
  });

  it('shows a not-found screen for unknown URLs with working header navigation', async () => {
    const user = userEvent.setup();
    renderRoute('/operations/unknown/path');
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: 'Профиль' }));
    expect(screen.getByRole('form', { name: 'Редактирование профиля' })).toBeInTheDocument();
  });
});
