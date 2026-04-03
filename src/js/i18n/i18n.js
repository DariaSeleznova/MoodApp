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
