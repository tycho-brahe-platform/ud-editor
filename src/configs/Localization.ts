import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { AppTexts } from './AppTexts';

export default function configLocalization() {
  // Dynamically build resources from AppTexts
  const resources = Object.keys(AppTexts).reduce((acc, lang) => {
    acc[lang] = {
      app: AppTexts[lang as keyof typeof AppTexts],
    };
    return acc;
  }, {} as Record<string, { app: (typeof AppTexts)[keyof typeof AppTexts] }>);

  i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      defaultNS: 'message',
      interpolation: {
        escapeValue: false,
      },
    });
}
