import { useTranslation } from 'react-i18next';
import { useTheme } from '../providers/ThemeProvider';
import './components.css';

export const ThemeSwitcher = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button className="ui-switcher" type="button" onClick={toggleTheme} aria-label={t('theme.toggle')} aria-pressed={theme === 'dark'}>
      <span aria-hidden="true">{theme === 'dark' ? '☾' : '☀'}</span>
      {t(`theme.${theme}`)}
    </button>
  );
};
