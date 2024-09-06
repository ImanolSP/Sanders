import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';
////TRADUCTOR FALTA POR ACABAR
const translations = { en, fr };

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale],
    'en', // default locale
    [{ locale: 'en', name: 'English' }, { locale: 'fr', name: 'Français' }],
);