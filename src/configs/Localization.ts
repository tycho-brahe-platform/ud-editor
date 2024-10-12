import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { HeaderTexts } from './localization/HeaderTexts';
import { EditableTexts } from './localization/EditableTexts';
import { MessageTexts } from './localization/MessageTexts';
import { HomeTexts } from './localization/HomeTexts';
import { LoginTexts } from './localization/LoginTexts';

export default function configLocalization() {
  i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
      resources: {
        en: {
          header: HeaderTexts.en,
          editable: EditableTexts.en,
          message: MessageTexts.en,
          home: HomeTexts.en,
          login: LoginTexts.en,
        },
        'pt-BR': {
          header: HeaderTexts['pt-BR'],
          editable: EditableTexts['pt-BR'],
          message: MessageTexts['pt-BR'],
          home: HomeTexts['pt-BR'],
          login: LoginTexts['pt-BR'],
        },
      },
      fallbackLng: 'en',
      defaultNS: 'message',
      interpolation: {
        escapeValue: false,
      },
    });
}
