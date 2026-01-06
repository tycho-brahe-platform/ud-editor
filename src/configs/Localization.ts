import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { AppTexts } from './AppTexts';

export default function configLocalization() {
  i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
      resources: {
        en: {
          app: AppTexts.en,
        },
        'pt-BR': {
          app: AppTexts['pt-BR'],
        },
      },
      fallbackLng: 'en',
      defaultNS: 'message',
      interpolation: {
        escapeValue: false,
      },
    });
}
