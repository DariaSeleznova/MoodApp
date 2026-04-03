import { logout, subscribeToAuthState } from '../services/authService.js';
import { translate, updateTexts } from '../i18n/i18n.js';

let initialized = false;

function getDisplayName(user) {
    return user?.displayName || translate('moodAppUser');
}

function getAvatarContent(user) {
    if (user?.photoURL) {
        return `<img src="${user.photoURL}" alt="${getDisplayName(user)}">`;
    }

    const fallback = getDisplayName(user).trim().charAt(0).toUpperCase() || 'U';
    return `<span>${fallback}</span>`;
}

function closeDropdown(container) {
    container?.classList.remove('open');
}

export function initProfileMenu() {
    if (initialized) {
        return;
    }

    const clientArea = document.querySelector('.client-area');
    const loginButton = clientArea?.querySelector('.login-btn');
    const signupButton = clientArea?.querySelector('.signup-btn');

    if (!clientArea || !loginButton || !signupButton) {
        return;
    }

    const profileWrapper = document.createElement('div');
    profileWrapper.className = 'profile-menu hidden';
    profileWrapper.innerHTML = `
        <button class="profile-menu__trigger" type="button" aria-label="${translate('userProfile')}">
            <span class="profile-menu__avatar"></span>
        </button>
        <div class="profile-menu__dropdown">
            <div class="profile-menu__user">
                <strong class="profile-menu__name"></strong>
                <span class="profile-menu__email"></span>
            </div>
            <a class="btn btn-secondary profile-menu__link" href="favorites.html" data-i18n="favorites">Favorites</a>
            <button class="btn btn-secondary profile-menu__logout" type="button" data-i18n="logout">Logout</button>
        </div>
    `;

    clientArea.insertBefore(profileWrapper, clientArea.querySelector('#lang-switch'));

    const trigger = profileWrapper.querySelector('.profile-menu__trigger');
    const avatar = profileWrapper.querySelector('.profile-menu__avatar');
    const name = profileWrapper.querySelector('.profile-menu__name');
    const email = profileWrapper.querySelector('.profile-menu__email');
    const logoutButton = profileWrapper.querySelector('.profile-menu__logout');

    updateTexts();

    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        profileWrapper.classList.toggle('open');
    });

    logoutButton.addEventListener('click', async () => {
        await logout();
        closeDropdown(profileWrapper);
    });

    document.addEventListener('click', (event) => {
        if (!profileWrapper.contains(event.target)) {
            closeDropdown(profileWrapper);
        }
    });

    subscribeToAuthState((user) => {
        const isAuthenticated = Boolean(user);

        loginButton.classList.toggle('hidden', isAuthenticated);
        signupButton.classList.toggle('hidden', isAuthenticated);
        profileWrapper.classList.toggle('hidden', !isAuthenticated);

        if (!isAuthenticated) {
            closeDropdown(profileWrapper);
            return;
        }

        avatar.innerHTML = getAvatarContent(user);
        name.textContent = getDisplayName(user);
        email.textContent = user.email || translate('noEmail');
    });

    initialized = true;
}
