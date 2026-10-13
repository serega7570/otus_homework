import { createInstance, type i18n } from 'i18next';
import { resources } from './translations';

export type Language = 'ru' | 'en';

export const createI18n = (language: Language): i18n => {
  const instance = createInstance();
  void instance.init({
    resources,
    lng: language,
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en'],
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
};
