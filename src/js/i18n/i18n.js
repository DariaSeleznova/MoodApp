import en from './en.js';
import uk from './uk.js';
import pl from './pl.js';
import es from './es.js';

const translations = {
    en,
    uk,
    pl,
    es
};

const langMap = {
    en: 'en-US',
    uk: 'uk-UA',
    pl: 'pl-PL',
    es: 'es-ES'
};

let currentLanguage = localStorage.getItem('lang') || 'en';

export function translate(key) {
    return translations[currentLanguage][key] || key;
}

export function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('lang', lang);
    updateTexts();
}

export function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = translate(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.setAttribute('placeholder', translate(key));
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.dataset.i18nAriaLabel;
        el.setAttribute('aria-label', translate(key));
    });
}

export function getApiLanguage() {
    return langMap[currentLanguage];
}
const googleLangMap = {
    en: 'en',
    uk: 'uk',
    pl: 'pl',
    es: 'es'
};

export function getBooksLanguage() {
    return googleLangMap[currentLanguage] || 'en';
}
