/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { memo } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTranslation } from 'react-i18next';
import { LanguageProvider, useLanguage } from './LanguageProvider';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

describe('provider patterns', () => {
  it('keeps the context and switcher synchronized with direct i18next language changes', async () => {
    const user = userEvent.setup();
    const Consumer = () => {
      const { i18n, t } = useTranslation();
      const { language } = useLanguage();
      return <>
        <output aria-label="Selected language">{language}</output>
        <p>{t('home.name')}</p>
        <button type="button" onClick={() => { void i18n.changeLanguage('en'); }}>Change via i18next</button>
        <LanguageSwitcher />
      </>;
    };
    render(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(screen.getByLabelText('Selected language')).toHaveTextContent('ru');
    await user.click(screen.getByRole('button', { name: 'Change via i18next' }));
    expect(screen.getByText('Sergey')).toBeInTheDocument();
    expect(screen.getByLabelText('Selected language')).toHaveTextContent('en');
    expect(screen.getByRole('combobox')).toHaveValue('en');
    await user.selectOptions(screen.getByRole('combobox'), 'ru');
    expect(screen.getByLabelText('Selected language')).toHaveTextContent('ru');
    expect(screen.getByText('Сергей')).toBeInTheDocument();
  });

  it('does not rerender a memoized language consumer when only its parent rerenders', () => {
    const renders = jest.fn();
    const Consumer = memo(function Consumer() {
      const { language } = useLanguage();
      renders();
      return <p>{language}</p>;
    });
    const { rerender } = render(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(renders).toHaveBeenCalledTimes(1);
    rerender(<LanguageProvider><Consumer /></LanguageProvider>);
    expect(renders).toHaveBeenCalledTimes(1);
  });

  it('avoids unrelated theme consumer renders but still publishes theme changes', async () => {
    const user = userEvent.setup();
    const renders = jest.fn();
    const Consumer = memo(function Consumer() {
      const { theme, toggleTheme } = useTheme();
      renders();
      return <button type="button" onClick={toggleTheme}>{theme}</button>;
    });
    const { rerender } = render(<ThemeProvider><Consumer /></ThemeProvider>);
    rerender(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(renders).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'light' }));
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument();
    expect(renders).toHaveBeenCalledTimes(2);
  });
});
