import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// EN locale
import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enAbout from './locales/en/about.json';
import enHowItWorks from './locales/en/howItWorks.json';
import enLegal from './locales/en/legal.json';
import enAuth from './locales/en/auth.json';
import enTriage from './locales/en/triage.json';
import enAdmin from './locales/en/admin.json';

// PL locale
import plCommon from './locales/pl/common.json';
import plLanding from './locales/pl/landing.json';
import plAbout from './locales/pl/about.json';
import plHowItWorks from './locales/pl/howItWorks.json';
import plLegal from './locales/pl/legal.json';
import plAuth from './locales/pl/auth.json';
import plTriage from './locales/pl/triage.json';
import plAdmin from './locales/pl/admin.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        landing: enLanding,
        about: enAbout,
        howItWorks: enHowItWorks,
        legal: enLegal,
        auth: enAuth,
        triage: enTriage,
        admin: enAdmin,
      },
      pl: {
        common: plCommon,
        landing: plLanding,
        about: plAbout,
        howItWorks: plHowItWorks,
        legal: plLegal,
        auth: plAuth,
        triage: plTriage,
        admin: plAdmin,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
