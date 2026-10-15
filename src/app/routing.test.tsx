/** @jest-environment ./src/test/FetchEnvironment.cjs */
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { StoreProvider } from './store/StoreProvider';
import { createAppStore } from './store/store';
import { appInitialized } from './store/sessionSlice';
import { createMockServer, errorResponse } from '../test/mockServer';
import { serverApi } from '../shared/api/serverApi';

const nativeFetch = globalThis.fetch;
let backend: ReturnType<typeof createMockServer>;
let store: ReturnType<typeof createAppStore>;
beforeEach(() => { backend = createMockServer(); globalThis.fetch = backend.fetch; store = createAppStore(); store.dispatch(appInitialized('server-token')); });
afterEach(() => { store.dispatch(serverApi.util.resetApiState()); globalThis.fetch = nativeFetch; });
const renderRoute = (route: string) => render(<ThemeProvider><LanguageProvider><StoreProvider store={store} syncTabs={false}>
  <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AppRoutes /></MemoryRouter>
</StoreProvider></LanguageProvider></ThemeProvider>);

it('loads server pages, appends without duplicates and stops at total', async () => {
  renderRoute('/operations');
  const user = userEvent.setup();
  await screen.findByRole('heading', { name: 'Операция 1' });
  expect(screen.getAllByRole('listitem')).toHaveLength(6);
  await user.click(screen.getByRole('button', { name: 'Показать ещё' }));
  await screen.findByRole('heading', { name: 'Операция 7' });
  expect(screen.getAllByRole('listitem')).toHaveLength(7);
  expect(screen.queryByRole('button', { name: 'Показать ещё' })).not.toBeInTheDocument();
  const requests = backend.requests.filter((r) => new URL(r.url).pathname === '/api/operations');
  expect(requests).toHaveLength(2);
  expect(requests.map((r) => JSON.parse(new URL(r.url).searchParams.get('pagination')!))).toEqual([{ pageSize: 6, pageNumber: 1 }, { pageSize: 6, pageNumber: 2 }]);
  expect(requests.every((r) => r.headers.get('Authorization') === 'Bearer server-token')).toBe(true);
});

it('preserves loaded rows when the next page fails and retries that page', async () => {
  let fail = true;
  backend.overrides.set('GET operations', (request) => {
    const page = JSON.parse(new URL(request.url).searchParams.get('pagination')!).pageNumber;
    if (page === 2 && fail) return errorResponse('ERR_INTERNAL_SERVER', 'Database unavailable');
    return Response.json({ data: backend.state.operations.slice((page - 1) * 6, page * 6), pagination: { pageSize: 6, pageNumber: page, total: 7 } });
  });
  renderRoute('/operations');
  const user = userEvent.setup();
  await screen.findByRole('heading', { name: 'Операция 1' });
  await user.click(screen.getByRole('button', { name: 'Показать ещё' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Ошибка сервера.');
  expect(screen.getAllByRole('listitem')).toHaveLength(6);
  fail = false;
  await user.click(screen.getByRole('button', { name: 'Повторить' }));
  await screen.findByRole('heading', { name: 'Операция 7' });
  expect(screen.getAllByRole('listitem')).toHaveLength(7);
});

it('automatically fetches a next page from IntersectionObserver and disconnects on unmount', async () => {
  const callbacks: { callback: IntersectionObserverCallback; active: boolean }[] = [];
  const original = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = class {
    entry: typeof callbacks[number];
    constructor(callback: IntersectionObserverCallback) { this.entry = { callback, active: true }; callbacks.push(this.entry); }
    observe() {}
    disconnect() { this.entry.active = false; }
  } as unknown as typeof IntersectionObserver;
  try {
    const view = renderRoute('/operations');
    await screen.findByRole('heading', { name: 'Операция 1' });
    await act(async () => {
      const entry = [...callbacks].reverse().find((item) => item.active)!;
      entry.callback([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);
      entry.callback([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);
    });
    await screen.findByRole('heading', { name: 'Операция 7' });
    expect(backend.requests.filter((r) => new URL(r.url).pathname === '/api/operations')).toHaveLength(2);
    view.unmount();
    expect(callbacks.every((item) => !item.active)).toBe(true);
  } finally { globalThis.IntersectionObserver = original; }
});

const fillOperation = async () => {
  const user = userEvent.setup();
  const form = within(await screen.findByRole('form', { name: 'Добавление операции' }));
  await user.type(form.getByLabelText('Название операции'), 'Покупка');
  await user.type(form.getByLabelText('Сумма, ₽'), '123.45');
  await user.selectOptions(form.getByLabelText('Категория'), 'category-1');
  fireEvent.change(form.getByLabelText('Дата операции'), { target: { value: '2026-10-14' } });
  await user.type(form.getByLabelText('Описание'), 'Продукты');
  return { user, form };
};

it('creates an operation with numeric amount, server category ID and ISO business date', async () => {
  renderRoute('/operations/new');
  const { user, form } = await fillOperation();
  await user.click(form.getByRole('button', { name: 'Добавить операцию' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(await screen.findByRole('heading', { name: 'Покупка' })).toBeInTheDocument();
  const request = backend.requests.find((r) => r.method === 'POST' && r.url.endsWith('/operations'))!;
  expect(await request.json()).toEqual({ name: 'Покупка', desc: 'Продукты', amount: 123.45, type: 'Cost', categoryId: 'category-1', date: '2026-10-14T00:00:00.000Z' });
});

it('fetches an edit URL directly even when the record is outside the loaded list page', async () => {
  renderRoute('/operations/operation-7/edit');
  const user = userEvent.setup();
  const form = within(await screen.findByRole('form', { name: 'Редактирование операции' }));
  expect(form.getByLabelText('Название операции')).toHaveValue('Операция 7');
  expect(form.getByLabelText('Дата операции')).toHaveValue('2026-10-14');
  await user.clear(form.getByLabelText('Название операции'));
  await user.type(form.getByLabelText('Название операции'), 'Обновлённая операция');
  await user.click(form.getByRole('button', { name: 'Сохранить операцию' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(backend.state.operations.find((item) => item.id === 'operation-7')?.name).toBe('Обновлённая операция');
  expect(backend.requests.some((r) => r.method === 'PUT' && r.url.endsWith('/operations/operation-7'))).toBe(true);
});

it('keeps an operation modal and values after a server validation failure', async () => {
  backend.overrides.set('POST operations', () => errorResponse('ERR_VALIDATION_ERROR', 'Name rejected', 'name'));
  renderRoute('/operations/new');
  const { user, form } = await fillOperation();
  await user.click(form.getByRole('button', { name: 'Добавить операцию' }));
  expect(await form.findByRole('alert')).toHaveTextContent('Name rejected');
  expect(form.getByLabelText('Название операции')).toHaveValue('Покупка');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  backend.overrides.delete('POST operations');
  await user.click(form.getByRole('button', { name: 'Добавить операцию' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

it('does not navigate after a cancelled editor receives a slow save response', async () => {
  let complete!: (response: Response) => void;
  backend.overrides.set('POST operations', () => new Promise((resolve) => { complete = resolve; }));
  renderRoute('/operations/new');
  const { user, form } = await fillOperation();
  await user.click(form.getByRole('button', { name: 'Добавить операцию' }));
  await waitFor(() => expect(complete).toBeDefined());
  await user.keyboard('{Escape}');
  await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: 'Товары и заказы' }));
  await screen.findByRole('heading', { name: 'Товары и заказы', level: 1 });
  await act(async () => { complete(Response.json({ ...backend.state.operations[0], id: 'slow-operation' })); });
  expect(screen.getByRole('heading', { name: 'Товары и заказы', level: 1 })).toBeInTheDocument();
});

it('creates a server category for a new account and loads it into the selector', async () => {
  backend.state.categories = [];
  renderRoute('/operations/new');
  const user = userEvent.setup();
  const dialog = within(await screen.findByRole('dialog'));
  await user.click(dialog.getByText('Создать категорию', { selector: 'summary' }));
  const form = within(dialog.getByRole('form', { name: 'Создать категорию' }));
  await user.type(form.getByLabelText('Название категории'), 'Новая категория');
  await user.click(form.getByRole('button'));
  expect(await dialog.findByRole('option', { name: 'Новая категория' })).toBeInTheDocument();
});

it('creates and edits products through POST and PUT', async () => {
  renderRoute('/shop');
  const user = userEvent.setup();
  await screen.findByRole('heading', { name: 'Товар 1' });
  await user.click(screen.getByRole('button', { name: 'Добавить товар' }));
  let form = within(await screen.findByRole('form', { name: 'Добавить товар' }));
  await user.type(form.getByLabelText('Название товара'), 'Новый товар');
  await user.type(form.getByLabelText('Цена, ₽'), '250.50');
  await user.selectOptions(form.getByLabelText('Категория'), 'category-1');
  await user.click(form.getByRole('button', { name: 'Добавить товар' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const article = within(await screen.findByRole('article', { name: 'Новый товар' }));
  await user.click(article.getByRole('button', { name: 'Редактировать' }));
  form = within(await screen.findByRole('form', { name: 'Редактировать товар' }));
  await user.clear(form.getByLabelText('Цена, ₽')); await user.type(form.getByLabelText('Цена, ₽'), '300');
  await user.click(form.getByRole('button', { name: 'Редактировать товар' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(backend.state.products.find((p) => p.id === 'products-new')?.price).toBe(300);
});

it('posts numeric cart quantities, clears the cart after success and shows the returned order', async () => {
  renderRoute('/shop');
  const user = userEvent.setup();
  const article = within(await screen.findByRole('article', { name: 'Товар 1' }));
  await user.click(article.getByRole('button', { name: 'В корзину' }));
  await user.clear(screen.getByLabelText('Количество: Товар 1'));
  await user.type(screen.getByLabelText('Количество: Товар 1'), '2');
  await user.click(screen.getByRole('button', { name: 'Оформить заказ' }));
  expect(await screen.findByText('Заказ создан. Номер: orders-new')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Оформить заказ' })).toBeDisabled();
  expect(await screen.findByRole('heading', { name: '№ orders-new' })).toBeInTheDocument();
  const request = backend.requests.find((r) => r.method === 'POST' && r.url.endsWith('/orders'))!;
  expect(await request.json()).toEqual({ products: [{ id: 'product-1', quantity: 2 }], status: 'pending_confirmation' });
  const ordersRequest = backend.requests.find((r) => new URL(r.url).pathname === '/api/orders')!;
  expect(JSON.parse(new URL(ordersRequest.url).searchParams.get('userId')!)).toBe('user-1');
});

it('validates quantity, preserves the cart on server failure and supports resubmission', async () => {
  backend.overrides.set('POST orders', () => errorResponse('ERR_INTERNAL_SERVER', 'Database failed'));
  renderRoute('/shop');
  const user = userEvent.setup();
  await user.click(within(await screen.findByRole('article', { name: 'Товар 1' })).getByRole('button', { name: 'В корзину' }));
  await user.clear(screen.getByLabelText('Количество: Товар 1'));
  await user.type(screen.getByLabelText('Количество: Товар 1'), '1.5');
  await user.click(screen.getByRole('button', { name: 'Оформить заказ' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Количество должно быть целым');
  expect(backend.requests.some((r) => r.method === 'POST' && r.url.endsWith('/orders'))).toBe(false);
  await user.clear(screen.getByLabelText('Количество: Товар 1'));
  await user.type(screen.getByLabelText('Количество: Товар 1'), '2');
  await user.click(screen.getByRole('button', { name: 'Оформить заказ' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Ошибка сервера.');
  expect(screen.getByLabelText('Количество: Товар 1')).toHaveValue(2);
  backend.overrides.delete('POST orders');
  await user.click(screen.getByRole('button', { name: 'Оформить заказ' }));
  expect(await screen.findByText('Заказ создан. Номер: orders-new')).toBeInTheDocument();
});
