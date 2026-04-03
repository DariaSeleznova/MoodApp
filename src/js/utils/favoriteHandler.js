import { toggleFavorite, isFavorite } from '../services/favoritesService';

export function setupFavoriteButton(button, item) {

    if (isFavorite(item.id)) {
        button.classList.add('active');
    }

    button.addEventListener('click', (e) => {
        e.stopPropagation();

        toggleFavorite(item);

        button.classList.toggle('active');
    });
}