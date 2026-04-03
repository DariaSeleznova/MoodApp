import {
    initAuthState,
    loginWithEmail,
    loginWithGoogle,
    runPendingAuthAction,
    signupWithEmail
} from '../services/authService.js';
import { translate, updateTexts } from '../i18n/i18n.js';

let modalElement = null;
let initialized = false;
const MODAL_CLOSE_DURATION_MS = 220;
let closeTimeoutId = null;

function getTabElements() {
    return {
        tabs: modalElement?.querySelectorAll('[data-auth-tab]') || [],
        panels: modalElement?.querySelectorAll('[data-auth-panel]') || []
    };
}

function setActiveTab(tab) {
    if (!modalElement) {
        return;
    }

    const { tabs, panels } = getTabElements();

    tabs.forEach(button => {
        button.classList.toggle('active', button.dataset.authTab === tab);
    });

    panels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.authPanel === tab);
    });
}

export function openAuthModal(tab = 'login') {
    if (!modalElement) {
        return;
    }

    setActiveTab(tab);
    if (closeTimeoutId) {
        clearTimeout(closeTimeoutId);
        closeTimeoutId = null;
    }

    modalElement.classList.remove('closing');
    document.body.classList.add('modal-open');

    requestAnimationFrame(() => {
        modalElement.classList.add('open');
    });
}

export function closeAuthModal() {
    if (!modalElement) {
        return;
    }

    modalElement.classList.remove('open');
    modalElement.classList.add('closing');

    if (closeTimeoutId) {
        clearTimeout(closeTimeoutId);
    }

    closeTimeoutId = setTimeout(() => {
        modalElement.classList.remove('closing');
        document.body.classList.remove('modal-open');
        closeTimeoutId = null;
    }, MODAL_CLOSE_DURATION_MS);
}

function buildModal() {
    const wrapper = document.createElement('div');
    wrapper.className = 'auth-modal';
    wrapper.innerHTML = `
        <div class="auth-modal__backdrop" data-auth-close></div>
        <div class="auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
            <button class="auth-modal__close" type="button" aria-label="${translate('close')}" data-auth-close>x</button>
            <h2 id="auth-modal-title" data-i18n="auth.titlePrompt">To add items to favorites, please log in or sign up</h2>
            <div class="auth-modal__tabs">
            
                <button class="auth-modal__tab active" type="button" data-auth-tab="login" data-i18n="login">Login</button>
                <button class="auth-modal__tab" type="button" data-auth-tab="signup" data-i18n="signup">Sign Up</button>
            </div>
            <div class="auth-modal__panel active" data-auth-panel="login">
                
                <form class="auth-form" data-auth-form="login">
                    <input class="auth-form__input" name="email" type="email" placeholder="${translate('emailPlaceholder')}" aria-label="${translate('emailPlaceholder')}" required>
                    <input class="auth-form__input" name="password" type="password" placeholder="${translate('passwordPlaceholder')}" aria-label="${translate('passwordPlaceholder')}" required>
                    <button class="btn btn-primary auth-form__submit" type="submit" data-i18n="login">Login</button>
                </form>
                <button class="btn btn-secondary auth-form__google" type="button" data-auth-google data-i18n="continueWithGoogle">Continue with Google</button>
            </div>
            <div class="auth-modal__panel" data-auth-panel="signup">
                <h2 id="auth-modal-title" data-i18n="auth.titlePrompt">To add items to favorites, please log in or sign up</h2>
                <form class="auth-form" data-auth-form="signup">
                    <input class="auth-form__input" name="name" type="text" placeholder="${translate('namePlaceholder')}" aria-label="${translate('namePlaceholder')}" required>
                    <input class="auth-form__input" name="email" type="email" placeholder="${translate('emailPlaceholder')}" aria-label="${translate('emailPlaceholder')}" required>
                    <input class="auth-form__input" name="password" type="password" placeholder="${translate('passwordPlaceholder')}" aria-label="${translate('passwordPlaceholder')}" required>
                    <button class="btn btn-primary auth-form__submit" type="submit" data-i18n="createAccount">Create Account</button>
                </form>
                <button class="btn btn-secondary auth-form__google" type="button" data-auth-google data-i18n="continueWithGoogle">Continue with Google</button>
            </div>
        </div>
    `;

    return wrapper;
}

export function initAuthModal() {
    if (initialized) {
        return;
    }

    initAuthState();
    modalElement = buildModal();
    document.body.appendChild(modalElement);
    updateTexts();

    modalElement.addEventListener('click', (event) => {
        if (event.target.closest('[data-auth-close]')) {
            closeAuthModal();
            return;
        }

        const tabButton = event.target.closest('[data-auth-tab]');
        if (tabButton) {
            setActiveTab(tabButton.dataset.authTab);
            return;
        }

        if (event.target.closest('[data-auth-google]')) {
            handleGoogleLogin();
        }
    });

    modalElement.querySelectorAll('[data-auth-form]').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                if (form.dataset.authForm === 'signup') {
                    await signupWithEmail(email, password);
                } else {
                    await loginWithEmail(email, password);
                }

                closeAuthModal();
                runPendingAuthAction();
                form.reset();
            } catch (error) {
                window.alert(error.message);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalElement?.classList.contains('open')) {
            closeAuthModal();
        }
    });

    initialized = true;
}

async function handleGoogleLogin() {
    try {
        await loginWithGoogle();
        closeAuthModal();
        runPendingAuthAction();
    } catch (error) {
        window.alert(error.message);
    }
}
