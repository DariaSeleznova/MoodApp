import { translate, updateTexts } from '../i18n/i18n.js';

let modalElement = null;
let initialized = false;
const MODAL_CLOSE_DURATION_MS = 220;
let closeTimeoutId = null;

function loadAuthService() {
    return import('../services/authService.js');
}

function setFormMessage(form, message, type = '') {
    const messageElement = form?.querySelector('[data-auth-message]');

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message || '';
    messageElement.dataset.state = type;
}

function clearFormMessage(form) {
    setFormMessage(form, '');
}

function getTabElements() {
    return {
        tabs: modalElement?.querySelectorAll('[data-auth-tab]') || [],
        panels: modalElement?.querySelectorAll('[data-auth-panel]') || []
    };
}

function setModalTitle(tab) {
    const titleElement = modalElement?.querySelector('#auth-modal-title');

    if (!titleElement) {
        return;
    }

    const titleKey = tab === 'signup' ? 'signup' : 'login';
    titleElement.dataset.i18n = titleKey;
    titleElement.textContent = translate(titleKey);
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

    setModalTitle(tab);
}

export function openAuthModal(tab = 'login') {
    if (!modalElement) {
        return;
    }

    void loadAuthService();
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
            <button class="auth-modal__close" type="button" data-auth-close data-i18n-aria-label="close">x</button>
            <h2 id="auth-modal-title" data-i18n="login">Login</h2>
            <div class="auth-modal__tabs">
            
                <button class="auth-modal__tab active" type="button" data-auth-tab="login" data-i18n="login">Login</button>
                <button class="auth-modal__tab" type="button" data-auth-tab="signup" data-i18n="signup">Sign Up</button>
            </div>
            <div class="auth-modal__panel active" data-auth-panel="login">
                
                <form class="auth-form" data-auth-form="login">
                    <input class="auth-form__input" name="email" type="email" data-i18n-placeholder="emailPlaceholder" data-i18n-aria-label="emailPlaceholder" required>
                    <input class="auth-form__input" name="password" type="password" data-i18n-placeholder="passwordPlaceholder" data-i18n-aria-label="passwordPlaceholder" required>
                    <button class="auth-form__forgot" type="button" data-auth-reset-password data-i18n="auth.forgotPassword">Forgot password?</button>
                    <p class="auth-form__message" data-auth-message aria-live="polite"></p>
                    <button class="btn btn-primary auth-form__submit" type="submit" data-i18n="login">Login</button>
                </form>
                <button class="btn btn-secondary auth-form__google" type="button" data-auth-google data-i18n="continueWithGoogle">Continue with Google</button>
            </div>
            <div class="auth-modal__panel" data-auth-panel="signup">
                <form class="auth-form" data-auth-form="signup">
                    <input class="auth-form__input" name="name" type="text" data-i18n-placeholder="namePlaceholder" data-i18n-aria-label="namePlaceholder" required>
                    <input class="auth-form__input" name="email" type="email" data-i18n-placeholder="emailPlaceholder" data-i18n-aria-label="emailPlaceholder" required>
                    <input class="auth-form__input" name="password" type="password" data-i18n-placeholder="passwordPlaceholder" data-i18n-aria-label="passwordPlaceholder" required>
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

        if (event.target.closest('[data-auth-reset-password]')) {
            handlePasswordReset(event.target.closest('[data-auth-form]'));
            return;
        }

        if (event.target.closest('[data-auth-google]')) {
            handleGoogleLogin();
        }
    });

    modalElement.querySelectorAll('[data-auth-form]').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearFormMessage(form);

            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                const { loginWithEmail, signupWithEmail, runPendingAuthAction } = await loadAuthService();

                if (form.dataset.authForm === 'signup') {
                    await signupWithEmail(name, email, password);
                } else {
                    await loginWithEmail(email, password);
                }

                closeAuthModal();

                form.reset();
                await runPendingAuthAction();
            } catch (error) {
                setFormMessage(form, error.message, 'error');
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

async function handlePasswordReset(form) {
    const emailInput = form?.querySelector('input[name="email"]');

    if (!emailInput) {
        return;
    }

    clearFormMessage(form);

    const email = emailInput.value.trim();
    emailInput.value = email;

    if (!email) {
        setFormMessage(form, translate('auth.resetEmailRequired'), 'error');
        emailInput.focus();
        return;
    }

    if (!emailInput.checkValidity()) {
        setFormMessage(form, translate('auth.resetEmailInvalid'), 'error');
        emailInput.reportValidity();
        return;
    }

    try {
        const { requestPasswordReset } = await loadAuthService();
        await requestPasswordReset(email);
        setFormMessage(form, translate('auth.resetEmailSent'), 'success');
    } catch (error) {
        setFormMessage(form, error.message, 'error');
    }
}

async function handleGoogleLogin() {
    try {
        const { loginWithGoogle, runPendingAuthAction } = await loadAuthService();
        await loginWithGoogle();
        closeAuthModal();
        await runPendingAuthAction();
    } catch (error) {
        window.alert(error.message);
    }
}
