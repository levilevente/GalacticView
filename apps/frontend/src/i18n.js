import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        load: 'languageOnly',
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false, // React already does escaping
        },
        ns: ['translation'],
        defaultNS: 'translation',
    })
    .then(() => {
        // i18n initialized successfully
    })
    .catch((err) => {
        console.error('i18n initialization failed:', err);
    });

export default i18n;
