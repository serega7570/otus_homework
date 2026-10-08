import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { resources } from './translations';

export type Language = 'ru' | 'en';

type LanguageContextValue = Readonly<{
  language: Language;
  setLanguage: (language: Language) => void;
}>;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({
  children,
  initialLanguage = 'ru',
}: Readonly<{ children: ReactNode; initialLanguage?: Language }>): JSX.Element => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [i18n] = useState(() => {
    const instance = createInstance();
    void instance.init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'ru',
      supportedLngs: ['ru', 'en'],
      initAsync: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return instance;
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (nextLanguage: Language): void => {
    void i18n.changeLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <I18nextProvider i18n={i18n}>
        <div lang={language} className="ui-language">{children}</div>
      </I18nextProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
