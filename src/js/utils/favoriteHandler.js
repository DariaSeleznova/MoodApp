import { toggleFavorite, isFavorite } from '../services/favoritesService';
import { getCurrentUser, getIsAuthenticated, setPendingAuthAction } from '../services/authService.js';
import { openAuthModal } from '../ui/authModal.js';

export function setupFavoriteButton(button, item) {

    if (isFavorite(item.id)) {
        button.classList.add('active');
    }

    button.addEventListener('click', async (e) => {
        e.stopPropagation();

        if (!getIsAuthenticated()) {
            setPendingAuthAction(() => {
                toggleFavorite(item, getCurrentUser());
                button.classList.toggle('active');
            });
            openAuthModal('login');
            return;
        }

        await toggleFavorite(item, getCurrentUser());
        button.classList.toggle('active');
    });
}
