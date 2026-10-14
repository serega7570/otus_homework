/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { StrictMode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageSwitcher, ModalWithInput, ThemeSwitcher } from '../shared/ui';

describe('homework 5 state management', () => {
  beforeEach(() => { window.history.replaceState(null, '', '/'); localStorage.clear(); });
  it('shows the entered text, closes the modal and uses the updated input on reopening', async () => {
    const user = userEvent.setup();
    render(<StrictMode><App /></StrictMode>);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const input = screen.getByRole('textbox', { name: 'Текст сообщения' });
    await user.type(input, 'Привет, OTUS!');
    await user.click(screen.getByRole('button', { name: 'Открыть модальное окно' }));
    expect(within(screen.getByRole('dialog')).getByText('Привет, OTUS!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Закрыть' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(input).toHaveValue('Привет, OTUS!');
    await user.clear(input);
    await user.type(input, 'Новое сообщение');
    await user.click(screen.getByRole('button', { name: 'Открыть модальное окно' }));
    expect(within(screen.getByRole('dialog')).getByText('Новое сообщение')).toBeInTheDocument();
    expect(screen.queryByText('Привет, OTUS!')).not.toBeInTheDocument();
  });

  it('switches the theme from Header for the entire page, including an open modal', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const header = within(screen.getByRole('banner'));
    const switcher = header.getByRole('button', { name: 'Переключить цветовую тему' });
    expect(container.querySelector('.ui-theme')).toHaveAttribute('data-theme', 'dark');
    expect(switcher).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Открыть модальное окно' }));
    await user.click(switcher);
    expect(container.querySelector('.ui-theme')).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('dialog').closest('[data-theme]')).toHaveAttribute('data-theme', 'light');
    expect(switcher).toHaveAttribute('aria-pressed', 'false');
    await user.click(switcher);
    expect(container.querySelector('.ui-theme')).toHaveAttribute('data-theme', 'dark');
  });

  it('translates the page and the open modal without losing user input', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole('textbox', { name: 'Текст сообщения' }), 'Мой текст');
    await user.click(screen.getByRole('button', { name: 'Открыть модальное окно' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Язык интерфейса' }), 'en');

    expect(screen.getByRole('heading', { name: 'Sergey' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Interface language' })).toHaveValue('en');
    expect(screen.getByRole('textbox', { name: 'Message text' })).toHaveValue('Мой текст');
    expect(within(screen.getByRole('dialog', { name: 'Modal window' })).getByText('Мой текст')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('lang', 'en');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Interface language' }), 'ru');
    expect(screen.getByRole('heading', { name: 'Сергей' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Модальное окно' })).toBeInTheDocument();
  });

  it('keeps independent provider trees isolated, as in Storybook docs', async () => {
    const user = userEvent.setup();
    const Demo = () => (
      <ThemeProvider>
        <LanguageProvider>
          <ThemeSwitcher />
          <LanguageSwitcher />
          <ModalWithInput />
        </LanguageProvider>
      </ThemeProvider>
    );
    render(<><section aria-label="First"><Demo /></section><section aria-label="Second"><Demo /></section></>);
    const first = within(screen.getByRole('region', { name: 'First' }));
    const second = within(screen.getByRole('region', { name: 'Second' }));
    await user.selectOptions(first.getByRole('combobox'), 'en');
    await user.click(first.getByRole('button', { name: 'Toggle color theme' }));

    expect(first.getByRole('button', { name: 'Open modal window' })).toBeInTheDocument();
    expect(first.getByRole('button', { name: 'Toggle color theme' })).toHaveAttribute('aria-pressed', 'true');
    expect(second.getByRole('button', { name: 'Открыть модальное окно' })).toBeInTheDocument();
    expect(second.getByRole('button', { name: 'Переключить цветовую тему' })).toHaveAttribute('aria-pressed', 'false');
    expect(second.getByRole('combobox')).toHaveValue('ru');
  });
});
