import { translate, updateTexts } from '../i18n/i18n.js';
import { getCurrentMood } from './events.js';
import { getUserName } from '../utils/getUserName.js';
import { closeDropdown, openDropdown } from './uiManager.js';

let initialized = false;
let currentProfileUser = null;

function loadAuthService() {
    return import('../services/authService.js');
}

function getDisplayName(user) {
    return getUserName(user, translate('profile.userFallback'));
}

function getAvatarContent(user) {
    if (user?.photoURL) {
        return `<img src="${user.photoURL}" alt="${getDisplayName(user)}">`;
    }

    return `
        <span class="profile-menu__avatar-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Zm0 2.25c-3.17 0-5.75 1.99-5.75 4.44 0 .17.14.31.31.31h10.88c.17 0 .31-.14.31-.31 0-2.45-2.58-4.44-5.75-4.44Z" />
            </svg>
        </span>
    `;
}

function formatMessage(key, values = {}) {
    return Object.entries(values).reduce((message, [token, value]) => {
        return message.replace(`{${token}}`, value);
    }, translate(key));
}

function getGreetingName(user) {
    return getUserName(user, translate('profile.userFallback'));
}

function getGreetingText(user) {
    return formatMessage('profile.greeting', {
        name: getGreetingName(user)
    });
}

function getGreetingSubtext() {
    const currentMood = getCurrentMood();

    if (!currentMood) {
        return translate('profile.question');
    }

    return formatMessage('profile.feeling', {
        mood: translate(currentMood).toLowerCase()
    });
}

function updateGreetingContent(user, greetingTitle, greetingText) {
    greetingTitle.textContent = getGreetingText(user);
    greetingText.textContent = getGreetingSubtext();
}

export function initProfileMenu() {
    if (initialized) {
        return;
    }

    const clientArea = document.querySelector('.client-area');
    const loginButton = clientArea?.querySelector('.login-btn');

    if (!clientArea || !loginButton) {
        return;
    }

    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'profile-menu hidden';
    profileWrapper.innerHTML = `
        <button class="profile-menu__trigger" type="button" aria-label="${translate('userProfile')}">
            <span class="profile-menu__avatar"></span>
            <span class="profile-menu__trigger-name"></span>
        </button>
        <div class="profile-menu__dropdown">
            <div class="profile-menu__greeting">
                <p class="profile-menu__greeting-title"></p>
                <p class="profile-menu__greeting-text"></p>
            </div>
            <a class="btn btn-secondary profile-menu__link" href="favorites.html" data-i18n="favorites">Favorites</a>
            <button class="btn btn-secondary profile-menu__logout" type="button" data-i18n="logout">Logout</button>
        </div>
    `;

    clientArea.insertBefore(profileWrapper, clientArea.querySelector('#lang-switch'));

    const trigger = profileWrapper.querySelector('.profile-menu__trigger');
    const avatar = profileWrapper.querySelector('.profile-menu__avatar');
    const triggerName = profileWrapper.querySelector('.profile-menu__trigger-name');
    const greetingTitle = profileWrapper.querySelector('.profile-menu__greeting-title');
    const greetingText = profileWrapper.querySelector('.profile-menu__greeting-text');
    const logoutButton = profileWrapper.querySelector('.profile-menu__logout');

    updateTexts();

    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        updateGreetingContent(currentProfileUser, greetingTitle, greetingText);
        if (profileWrapper.classList.contains('open')) {
            closeDropdown(profileWrapper, trigger);
            return;
        }

        openDropdown(profileWrapper, trigger);
    });

    logoutButton.addEventListener('click', async () => {
        const { logout } = await loadAuthService();
        await logout();
        closeDropdown(profileWrapper, trigger);
    });

    void loadAuthService().then(({ subscribeToAuthState }) => {
        subscribeToAuthState((user) => {
            currentProfileUser = user;
            const isAuthenticated = Boolean(user);

            loginButton.classList.toggle('hidden', isAuthenticated);
            profileWrapper.classList.toggle('hidden', !isAuthenticated);

            if (!isAuthenticated) {
                closeDropdown(profileWrapper, trigger);
                return;
            }

            avatar.innerHTML = getAvatarContent(user);
            triggerName.textContent = getUserName(user, translate('profile.userFallback'));
            updateGreetingContent(user, greetingTitle, greetingText);
        });
    });

    initialized = true;
}
