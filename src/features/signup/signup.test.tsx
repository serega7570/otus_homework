/** @jest-environment ./src/test/FetchEnvironment.cjs */
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../../app/App';
import { createAppStore, type AppStore } from '../../app/store/store';
import { StoreProvider } from '../../app/store/StoreProvider';
import { ThemeProvider } from '../../shared/providers/ThemeProvider';
import { LanguageProvider } from '../../shared/providers/LanguageProvider';
import { FetchSignup } from './FetchSignup';
import { RtkQuerySignup } from './RtkQuerySignup';
import { SIGNUP_API_URL, SIGNUP_COMMAND_ID, SIGNUP_TIMEOUT_MS, signupApi } from './signupApi';

const serverError = (code: string, message: string, fieldName?: string) => ({
  errors: [{ extensions: { code }, message, fieldName, stack: 'PRIVATE SERVER STACK' }],
});
const invalidEmail = serverError('ERR_VALIDATION_ERROR', '"invalid-email" is not valid email');
const nativeFetch = globalThis.fetch;
let fetchMock: jest.MockedFunction<typeof fetch>;
let store: AppStore;

beforeEach(() => {
  fetchMock = jest.fn();
  globalThis.fetch = fetchMock;
  store = createAppStore();
});
afterEach(() => {
  store.dispatch(signupApi.util.resetApiState());
  globalThis.fetch = nativeFetch;
  jest.useRealTimers();
});

const renderSignup = (component: JSX.Element) => render(
  <ThemeProvider><LanguageProvider><StoreProvider store={store} syncTabs={false}>
    {component}
  </StoreProvider></LanguageProvider></ThemeProvider>,
);

const fillAndSubmit = async (email = 'invalid-email', password = 'short') => {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByLabelText('Email'), email);
  if (password) await user.type(screen.getByLabelText('Пароль'), password);
  await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
};

const sentRequest = () => {
  const [input, init] = fetchMock.mock.calls[0];
  return input instanceof Request ? input : new Request(input, init);
};

describe.each([
  ['Fetch', FetchSignup], ['RTK Query', RtkQuerySignup],
] as const)('%s registration', (_name, Component) => {
  it('sends invalid email and short password to the real endpoint and displays its field error', async () => {
    fetchMock.mockImplementation(async () => Response.json(invalidEmail, { status: 400 }));
    renderSignup(<Component />);
    await fillAndSubmit();
    const request = sentRequest();
    expect(request.url).toBe(`${SIGNUP_API_URL}signup`);
    expect(request.method).toBe('POST');
    expect(request.headers.get('Content-Type')).toContain('application/json');
    expect(await request.json()).toEqual({ email: 'invalid-email', password: 'short', commandId: SIGNUP_COMMAND_ID });
    expect(await screen.findByRole('alert')).toHaveTextContent('Укажите корректный email.');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText(/PRIVATE SERVER STACK/)).not.toBeInTheDocument();
    expect(screen.getByRole('form')).toHaveAttribute('novalidate');
  });

  it('submits empty fields instead of validating in the browser', async () => {
    fetchMock.mockImplementation(async () => Response.json(serverError('ERR_FIELD_REQUIRED', 'Email is required', 'email'), { status: 400 }));
    renderSignup(<Component />);
    await fillAndSubmit('', '');
    expect(await sentRequest().json()).toMatchObject({ email: '', password: '' });
    expect(await screen.findByRole('alert')).toHaveTextContent('Заполните это поле.');
  });

  it('shows success, clears the password and excludes the returned profile from Redux', async () => {
    fetchMock.mockImplementation(async () => Response.json({ token: 'real-token', profile: { password: 'SERVER_HASH' } }));
    renderSignup(<Component />);
    await fillAndSubmit('new@example.com', 'password8');
    expect(await screen.findByRole('status')).toHaveTextContent('Пользователь успешно зарегистрирован.');
    await waitFor(() => expect(screen.getByLabelText('Пароль')).toHaveValue(''));
    expect(screen.getByLabelText('Email')).toHaveValue('new@example.com');
    expect(JSON.stringify(store.getState())).not.toMatch(/password8|SERVER_HASH/);
  });

  it('locks the form during a request and prevents duplicate submits', async () => {
    let complete!: (response: Response) => void;
    fetchMock.mockImplementation(() => new Promise((resolve) => { complete = resolve; }));
    renderSignup(<Component />);
    await fillAndSubmit();
    expect(screen.getByRole('button', { name: 'Отправка…' })).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Пароль')).toBeDisabled();
    fireEvent.submit(screen.getByRole('form'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { complete(Response.json(invalidEmail, { status: 400 })); });
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeEnabled();
  });

  it.each([
    ['ERR_ACCOUNT_ALREADY_EXIST', 'Account already exists', 'Пользователь с таким email уже существует.', 'Email'],
    ['ERR_INVALID_PASSWORD', 'Invalid password', 'Пароль не соответствует требованиям сервера.', 'Пароль'],
  ])('maps %s to the relevant field', async (code, message, expected, field) => {
    fetchMock.mockImplementation(async () => Response.json(serverError(code, message), { status: 400 }));
    renderSignup(<Component />);
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(expected);
    expect(screen.getByLabelText(field)).toHaveAttribute('aria-invalid', 'true');
  });

  it('displays field errors and general errors from the same response', async () => {
    fetchMock.mockImplementation(async () => Response.json({ errors: [
      ...invalidEmail.errors,
      ...serverError('ERR_FIELD_REQUIRED', 'Password required', 'password').errors,
      ...serverError('NEW_ERROR_CODE', 'Registration is temporarily disabled').errors,
    ] }, { status: 400 }));
    renderSignup(<Component />);
    await fillAndSubmit();
    expect(await screen.findAllByRole('alert')).toHaveLength(3);
    expect(screen.getByText('Registration is temporarily disabled')).toBeInTheDocument();
  });

  it.each([
    ['HTML error', () => new Response('<h1>Bad gateway</h1>', { status: 502 }), 'Не удалось зарегистрироваться.'],
    ['missing token', () => Response.json({ profile: {} }), 'Не удалось зарегистрироваться.'],
    ['empty token', () => Response.json({ token: '' }), 'Не удалось зарегистрироваться.'],
    ['error envelope with status 200', () => Response.json(invalidEmail), 'Укажите корректный email.'],
    ['internal error', () => Response.json(serverError('ERR_INTERNAL_SERVER', 'Database private details'), { status: 500 }), 'Ошибка сервера.'],
  ])('handles %s without displaying success or crashing', async (_scenario, response, expected) => {
    fetchMock.mockImplementation(async () => response());
    renderSignup(<Component />);
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(expected);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('handles a network failure, clears stale errors on editing and allows retry', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    fetchMock.mockImplementationOnce(async () => Response.json({ token: 'new-token' }));
    renderSignup(<Component />);
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось связаться с сервером.');
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText('Email'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports a request timeout and unlocks submission', async () => {
    jest.useFakeTimers();
    fetchMock.mockImplementation((input, init) => new Promise((_resolve, reject) => {
      const signal = input instanceof Request ? input.signal : init?.signal;
      signal?.addEventListener('abort', () => reject(signal.reason));
    }));
    renderSignup(<Component />);
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await act(async () => { jest.advanceTimersByTime(SIGNUP_TIMEOUT_MS); });
    expect(await screen.findByRole('alert')).toHaveTextContent('Сервер не ответил вовремя.');
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeEnabled();
  });
});

it('opens the public registration screen, keeps forms independent and translates errors', async () => {
  fetchMock.mockImplementation(async () => Response.json(invalidEmail, { status: 400 }));
  renderSignup(<MemoryRouter initialEntries={['/signup']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppRoutes />
  </MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Регистрация', level: 1 })).toBeInTheDocument();
  expect(within(screen.getByRole('navigation')).getByRole('link', { name: 'Регистрация' })).toHaveAttribute('aria-current', 'page');
  const fetchForm = within(screen.getByRole('form', { name: 'Регистрация — Fetch' }));
  const rtkForm = within(screen.getByRole('form', { name: 'Регистрация — RTK Query' }));
  const user = userEvent.setup();
  await user.type(fetchForm.getByLabelText('Email'), 'invalid-email');
  await user.click(fetchForm.getByRole('button'));
  expect(await fetchForm.findByRole('alert')).toBeInTheDocument();
  expect(rtkForm.queryByRole('alert')).not.toBeInTheDocument();
  expect(rtkForm.getByLabelText('Email')).toHaveValue('');
  await user.selectOptions(screen.getByRole('combobox', { name: 'Язык интерфейса' }), 'en');
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
  expect(screen.getByRole('form', { name: 'Registration — Fetch' })).toBeInTheDocument();
  expect(fetchForm.getByLabelText('Email')).toHaveValue('invalid-email');
});
