import polyglotI18nProvider from 'ra-i18n-polyglot';
import { spanishMessages } from '../languages';
import { englishMessages } from '../languages';


export const i18nProvider = polyglotI18nProvider(
    locale => locale === 'es' ? spanishMessages : englishMessages, // Return the appropriate language messages
    'en' // Default language is Spanish
);
