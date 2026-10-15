import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createI18n, type Language } from './createI18n';

export type { Language } from './createI18n';

type LanguageContextValue = Readonly<{
  language: Language;
  setLanguage: (language: Language) => void;
}>;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({
  children,
  initialLanguage = 'ru',
}: Readonly<{ children: ReactNode; initialLanguage?: Language }>): JSX.Element => {
  const [i18n] = useState(() => createI18n(initialLanguage));
  const subscribe = useCallback((listener: () => void) => {
    i18n.on('languageChanged', listener);
    return () => { i18n.off('languageChanged', listener); };
  }, [i18n]);
  const getLanguage = useCallback((): Language => (
    i18n.resolvedLanguage === 'en' ? 'en' : 'ru'
  ), [i18n]);
  const language = useSyncExternalStore(subscribe, getLanguage, getLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language): void => {
    void i18n.changeLanguage(nextLanguage);
  }, [i18n]);
  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
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
