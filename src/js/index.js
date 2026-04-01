import '../styles/main.scss';
import { mood } from './ui/events.js';
import happy from '../assets/icons/happy.png';
import sad from '../assets/icons/sad.png';
import excited from '../assets/icons/excited.png';
import relaxed from '../assets/icons/relax.png';
import spirited from '../assets/icons/spirited.png';
import tired from '../assets/icons/tired.png';
import logo from '../assets/icons/logo.png';
import { setLanguage, updateTexts } from '../js/i18n/i18n.js';

const moodImages = {
    happy,
    sad,
    excited,
    relaxed,
    spirited,
    tired
};
document.querySelectorAll('.mood-btn').forEach((btn) => {
    const mood = btn.dataset.mood;

    const img = document.createElement('img');
    img.src = moodImages[mood];
    img.alt = mood;

    const text = document.createElement('span');
    text.setAttribute('data-i18n', mood);
    text.classList.add('mood-text');

    btn.appendChild(img);
    btn.appendChild(text);

});

document.addEventListener('DOMContentLoaded', () => {
    const logoImg = document.querySelector('.logo img');

    if (!logoImg) {
        console.log('❌ logo не найден');
        return;
    }

    logoImg.src = logo;
});

const langSwitch = document.getElementById('lang-switch');

langSwitch.addEventListener('change', (e) => {
    setLanguage(e.target.value);
});


document.addEventListener('DOMContentLoaded', () => {
    updateTexts();
});
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    langSwitch.value = savedLang;
    setLanguage(savedLang);
});