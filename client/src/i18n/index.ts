import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonAr from '../locales/ar/common.json';
import commonEn from '../locales/en/common.json';

const savedLang = localStorage.getItem('bb_language') || 'ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        common: commonAr,
      },
      en: {
        common: commonEn,
      },
    },
    defaultNS: 'common',
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

// Apply document changes for initial load
const applyDocAttributes = (lang: string) => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};
applyDocAttributes(savedLang);

i18n.on('languageChanged', (lng) => {
  applyDocAttributes(lng);
  if (window.location.pathname.startsWith('/admin')) {
    localStorage.setItem('bb_admin_language', lng);
  } else {
    localStorage.setItem('bb_language', lng);
  }
});

export default i18n;
