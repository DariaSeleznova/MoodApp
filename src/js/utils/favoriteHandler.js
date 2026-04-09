import { isFavorite } from './favoritesStorage.js';

function loadAuthService() {
    return import('../services/authService.js');
}

function loadFavoritesService() {
    return import('../services/favoritesService.js');
}

function loadAuthModal() {
    return import('../ui/authModal.js');
}

async function applyFavoriteToggle(button, item) {
    const wasActive = button.classList.contains('active');
    button.classList.toggle('active');

    try {
        const { toggleFavorite } = await loadFavoritesService();
        const { getCurrentUser } = await loadAuthService();
        await toggleFavorite(item, getCurrentUser());
    } catch (error) {
        button.classList.toggle('active', wasActive);
        window.alert('Could not save favorite. Please try again.');
    }
}

export function setupFavoriteButton(button, item) {

    if (isFavorite(item.id, item.type)) {
        button.classList.add('active');
    }

    button.addEventListener('click', async (e) => {
        e.stopPropagation();

        const { getIsAuthenticated, setPendingAuthAction } = await loadAuthService();

        if (!getIsAuthenticated()) {
            setPendingAuthAction(async () => {
                await applyFavoriteToggle(button, item);
            });
            const { initAuthModal, openAuthModal } = await loadAuthModal();
            initAuthModal();
            openAuthModal('login');
            return;
        }

        await applyFavoriteToggle(button, item);
    });
}
