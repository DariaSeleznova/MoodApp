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
import { initAuthModal, openAuthModal } from './ui/authModal.js';
import { initAuthState } from './services/authService.js';
import { initProfileMenu } from './ui/profileMenu.js';

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

function init() {
    initAuthState();
    initAuthModal();
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

    document.querySelector('.login-btn')?.addEventListener('click', () => {
        openAuthModal('login');
    });

    document.querySelector('.signup-btn')?.addEventListener('click', () => {
        openAuthModal('signup');
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

    const closeDropdown = () => {
        langSwitch.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    };

    const openDropdown = () => {
        langSwitch.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
    };

    updateSelectedLanguage(initialLang);

    trigger.addEventListener('click', () => {
        if (langSwitch.classList.contains('open')) {
            closeDropdown();
            return;
        }

        openDropdown();
    });

    trigger.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDropdown();
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
            closeDropdown();
        });

        option.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeDropdown();
                trigger.focus();
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!langSwitch.contains(event.target)) {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && langSwitch.classList.contains('open')) {
            closeDropdown();
            trigger.focus();
        }
    });
}
