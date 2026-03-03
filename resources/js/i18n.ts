import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import ar from './locales/ar/translation.json';

// Explicitly loading resources to avoid HTTP backend issues in some environments
// or use Backend if you prefer loading from /locales
const resources = {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
};

i18n
    // .use(Backend) // access /locales/en/translation.json
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr', // Default to French
        supportedLngs: ['fr', 'en', 'ar'],

        interpolation: {
            escapeValue: false, // react already safes from xss
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
