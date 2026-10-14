/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../shared/providers/LanguageProvider';
import { LanguageSwitcher } from '../../shared/ui/LanguageSwitcher';
import { ProfileEditor } from './ProfileForm/ProfileEditor';
import { OperationForm } from './OperationForm/OperationForm';
import { AuthForm } from './AuthForm/AuthForm';
import { sampleOperation, sampleProfile } from './samples';

let log: jest.SpyInstance;
beforeEach(() => { log = jest.spyOn(console, 'log').mockImplementation(() => undefined); });
afterEach(() => { jest.restoreAllMocks(); });

it('edits the transferred profile form, rejects invalid data and clears even prefilled values after submission', async () => {
  const user = userEvent.setup();
  render(<LanguageProvider><ProfileEditor initialValues={sampleProfile} /></LanguageProvider>);
  const name = screen.getByRole('textbox', { name: 'Имя' });
  const about = screen.getByRole('textbox', { name: 'О себе' });
  expect(name).toHaveValue('Сергей');
  await user.clear(name);
  await user.click(screen.getByRole('button', { name: 'Сохранить профиль' }));
  expect(await screen.findByText('Заполните поле.')).toHaveAttribute('role', 'alert');
  expect(name).toHaveAttribute('aria-invalid', 'true');
  expect(log).not.toHaveBeenCalled();
  expect(about).toHaveValue(sampleProfile.about);
  await user.type(name, '  Анна  ');
  await user.clear(about);
  await user.type(about, '  Изучаю формы  ');
  await user.click(screen.getByRole('button', { name: 'Сохранить профиль' }));
  await waitFor(() => expect(log).toHaveBeenCalledWith('ProfileForm', { name: 'Анна', about: 'Изучаю формы' }));
  expect(log).toHaveBeenCalledTimes(1);
  expect(name).toHaveValue('');
  expect(about).toHaveValue('');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Форма отправлена');
  await user.type(name, 'Новое имя');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('updates profile values supplied by a parent, as in Storybook Controls', async () => {
  const { rerender } = render(<LanguageProvider><ProfileEditor initialValues={sampleProfile} /></LanguageProvider>);
  rerender(<LanguageProvider><ProfileEditor initialValues={{ name: 'Новое имя', about: 'Новое описание' }} /></LanguageProvider>);
  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveValue('Новое имя'));
  expect(screen.getByRole('textbox', { name: 'О себе' })).toHaveValue('Новое описание');
});

it.each(['create', 'edit'] as const)('validates and submits an operation in %s mode with a numeric amount and clears all fields', async (mode) => {
  const user = userEvent.setup();
  render(<LanguageProvider><OperationForm mode={mode} initialValues={mode === 'edit' ? sampleOperation : undefined} /></LanguageProvider>);
  const submit = screen.getByRole('button', { name: mode === 'create' ? 'Добавить операцию' : 'Сохранить операцию' });
  const amount = screen.getByRole('spinbutton', { name: 'Сумма, ₽' });
  const name = screen.getByRole('textbox', { name: 'Название операции' });
  if (mode === 'create') {
    await user.click(submit);
    expect((await screen.findAllByText('Заполните поле.')).length).toBe(4);
    expect(log).not.toHaveBeenCalled();
    await user.type(name, 'Покупка продуктов');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Категория' }), 'food');
    await user.type(screen.getByLabelText('Дата операции *'), '2026-10-13');
  }
  await user.clear(amount);
  await user.type(amount, '1.234');
  await user.click(submit);
  expect(await screen.findByText(/Введите сумму от/)).toBeInTheDocument();
  expect(log).not.toHaveBeenCalled();
  expect(name).toHaveValue('Покупка продуктов');
  await user.clear(amount);
  await user.type(amount, '1250.50');
  await user.click(submit);
  await waitFor(() => expect(log).toHaveBeenCalledWith('OperationForm', {
    mode, name: 'Покупка продуктов', desc: mode === 'edit' ? sampleOperation.desc : '', amount: 1250.5, type: 'Cost',
    category: { id: 'food', name: 'Food' }, createdAt: '2026-10-13T00:00:00.000Z',
  }));
  expect(name).toHaveValue('');
  expect(amount).toHaveValue(null);
  expect(screen.getByRole('combobox', { name: 'Категория' })).toHaveValue('');
  expect(screen.getByLabelText('Дата операции *')).toHaveValue('');
  expect(screen.getByRole('textbox', { name: 'Описание' })).toHaveValue('');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('rejects malformed email and a short login password, then logs and clears valid credentials', async () => {
  const user = userEvent.setup();
  render(<LanguageProvider><AuthForm /></LanguageProvider>);
  const email = screen.getByRole('textbox', { name: 'Email' });
  const password = screen.getByLabelText('Пароль *');
  await user.type(email, 'bad-email');
  await user.type(password, 'short');
  await user.click(screen.getByRole('button', { name: 'Войти' }));
  expect(await screen.findByText(/Введите корректный email/)).toBeInTheDocument();
  expect(screen.getByText('Пароль должен содержать от 8 до 128 символов.')).toBeInTheDocument();
  expect(log).not.toHaveBeenCalled();
  await user.clear(email);
  await user.type(email, 'anna@example.com');
  await user.clear(password);
  await user.type(password, 'Password1');
  await user.click(screen.getByRole('button', { name: 'Войти' }));
  await waitFor(() => expect(log).toHaveBeenCalledWith('LoginForm', { email: 'anna@example.com', password: 'Password1' }));
  expect(email).toHaveValue('');
  expect(password).toHaveValue('');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('checks password confirmation for registration and clears all three fields after a valid submission', async () => {
  const user = userEvent.setup();
  render(<LanguageProvider><AuthForm mode="register" /></LanguageProvider>);
  const email = screen.getByRole('textbox', { name: 'Email' });
  const password = screen.getByLabelText('Пароль *');
  const confirm = screen.getByLabelText('Повторите пароль *');
  await user.type(email, 'anna@example.com');
  await user.type(password, 'Password1');
  await user.type(confirm, 'Password2');
  await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
  expect(await screen.findByText('Пароли должны совпадать.')).toBeInTheDocument();
  expect(log).not.toHaveBeenCalled();
  await user.clear(confirm);
  await user.type(confirm, 'Password1');
  await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
  await waitFor(() => expect(log).toHaveBeenCalledWith('RegistrationForm', { email: 'anna@example.com', password: 'Password1' }));
  expect(log).toHaveBeenCalledTimes(1);
  for (const field of [email, password, confirm]) expect(field).toHaveValue('');
  await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
  expect((await screen.findAllByText('Заполните поле.')).length).toBe(3);
  expect(log).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('clears credentials and errors when changing authentication mode', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<LanguageProvider><AuthForm mode="register" /></LanguageProvider>);
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'bad-email');
  await user.type(screen.getByLabelText('Пароль *'), 'short');
  await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));
  await screen.findByText('Заполните поле.');
  rerender(<LanguageProvider><AuthForm mode="login" /></LanguageProvider>);
  expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('');
  expect(screen.getByLabelText('Пароль *')).toHaveValue('');
  expect(screen.queryByLabelText('Повторите пароль *')).not.toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('translates visible validation errors immediately without losing entered values', async () => {
  const user = userEvent.setup();
  render(<LanguageProvider><LanguageSwitcher /><AuthForm /></LanguageProvider>);
  await user.type(screen.getByRole('textbox', { name: 'Email' }), 'bad-email');
  await user.click(screen.getByRole('button', { name: 'Войти' }));
  await screen.findByText(/Введите корректный email/);
  await user.selectOptions(screen.getByRole('combobox'), 'en');
  expect(screen.getByText(/Enter a valid email/)).toBeInTheDocument();
  expect(screen.getByText('Fill in this field.')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('bad-email');
  expect(screen.getByLabelText('Password *')).toHaveAccessibleDescription('8 to 128 characters. Fill in this field.');
});
