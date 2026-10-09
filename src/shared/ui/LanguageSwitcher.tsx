import { useTranslation } from 'react-i18next';
import { useLanguage } from '../providers/LanguageProvider';
import './components.css';

export const LanguageSwitcher = (): JSX.Element => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <select className="ui-switcher" aria-label={t('language.label')} value={language} onChange={(event) => setLanguage(event.target.value === 'en' ? 'en' : 'ru')}>
      <option value="ru">Русский</option>
      <option value="en">English</option>
    </select>
  );
};
