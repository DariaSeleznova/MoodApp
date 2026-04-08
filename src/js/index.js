import '../styles/main.scss';
import { resetAppState } from './ui/events.js';
import happy from '../assets/icons/happy.png';
import sad from '../assets/icons/sad.png';
import excited from '../assets/icons/excited.png';
import relaxed from '../assets/icons/relax.png';
import spirited from '../assets/icons/spirited.png';
import tired from '../assets/icons/tired.png';
import logo from '../assets/icons/logo.png';
import { setLanguage } from '../js/i18n/i18n.js';
import { initProfileMenu } from './ui/profileMenu.js';
import { closeDropdown, openDropdown } from './ui/uiManager.js';

const moodImages = {
    happy,
    sad,
    excited,
    relaxed,
    spirited,
    tired
};

document.querySelectorAll('.mood-btn').forEach((btn) => {
    const currentMood = btn.dataset.mood;

    const img = document.createElement('img');
    img.src = moodImages[currentMood];
    img.alt = currentMood;

    const text = document.createElement('span');
    text.setAttribute('data-i18n', currentMood);
    text.classList.add('mood-text');

    btn.appendChild(img);
    btn.appendChild(text);
});

document.addEventListener('DOMContentLoaded', init);

function loadAuthService() {
    return import('./services/authService.js');
}

function loadAuthModal() {
    return import('./ui/authModal.js');
}

function init() {
    void loadAuthService().then(({ initAuthState }) => {
        initAuthState();
    });
    initProfileMenu();

    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
        logoImg.src = logo;
    }

    document.querySelector('.logo')?.addEventListener('click', (event) => {
        event.preventDefault();
        resetAppState();
    });

    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
    initLanguageSwitch(savedLang);
    initMoodPanel();

    document.querySelector('.login-btn')?.addEventListener('click', () => {
        void loadAuthModal().then(({ initAuthModal, openAuthModal }) => {
            initAuthModal();
            openAuthModal('login');
        });
    });
}

function initMoodPanel() {
    const toggleButton = document.querySelector('[data-mood-toggle]');
    const backdrop = document.querySelector('[data-mood-backdrop]');
    const moodNav = document.querySelector('.mood-nav');

    if (!toggleButton || !backdrop || !moodNav) {
        return;
    }

    const mobileMedia = window.matchMedia('(max-width: 426px)');

    const closePanel = () => {
        document.body.classList.remove('mood-panel-open');
        toggleButton.setAttribute('aria-expanded', 'false');
    };

    const openPanel = () => {
        document.body.classList.add('mood-panel-open');
        toggleButton.setAttribute('aria-expanded', 'true');
    };

    toggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('mood-panel-open')) {
            closePanel();
            return;
        }

        openPanel();
    });

    backdrop.addEventListener('click', closePanel);

    moodNav.querySelectorAll('.mood-btn').forEach((button) => {
        button.addEventListener('click', () => {
            if (mobileMedia.matches) {
                closePanel();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('mood-panel-open')) {
            closePanel();
        }
    });

    mobileMedia.addEventListener('change', (event) => {
        if (!event.matches) {
            closePanel();
        }
    });
}

function initLanguageSwitch(initialLang) {
    const langSwitch = document.getElementById('lang-switch');

    if (!langSwitch) {
        return;
    }

    const trigger = langSwitch.querySelector('.language-switch__trigger');
    const label = langSwitch.querySelector('.language-switch__label');
    const options = Array.from(langSwitch.querySelectorAll('.language-switch__option'));
    const languageCodes = {
        en: 'EN',
        uk: 'UA',
        pl: 'PL',
        es: 'ES'
    };

    const updateSelectedLanguage = (lang) => {
        label.textContent = languageCodes[lang] || lang.toUpperCase();
        document.documentElement.lang = lang;

        options.forEach((option) => {
            const isActive = option.dataset.lang === lang;
            option.classList.toggle('active', isActive);
            option.setAttribute('aria-checked', String(isActive));
        });
    };

    updateSelectedLanguage(initialLang);

    trigger.addEventListener('click', () => {
        if (langSwitch.classList.contains('open')) {
            closeDropdown(langSwitch, trigger);
            return;
        }

        openDropdown(langSwitch, trigger);
    });

    trigger.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDropdown(langSwitch, trigger);
            options[0]?.focus();
        }
    });

    options.forEach((option) => {
        option.addEventListener('click', () => {
            const nextLang = option.dataset.lang;

            if (!nextLang) {
                return;
            }

            setLanguage(nextLang);
            updateSelectedLanguage(nextLang);
            closeDropdown(langSwitch, trigger);
        });

        option.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDropdown(langSwitch, trigger);
                trigger.focus();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && langSwitch.classList.contains('open')) {
            closeDropdown(langSwitch, trigger);
            trigger.focus();
        }
    });
}
