import { addUserFavorite, ensureUserDocument, getUserFavorites, removeUserFavorite } from './userDataService.js';
import {
    getFavoritesFromStorage,
    isFavorite,
    readFavorites,
    writeFavoritesToStorage
} from '../utils/favoritesStorage.js';

function isFavoriteRecord(item) {
    return Boolean(item) && typeof item === 'object' && 'id' in item;
}

export function writeFavorites(favorites) {
    writeFavoritesToStorage(favorites);
    updateFavoritesUI();
}

export function updateFavoritesUI() {
    const cardSelector = [
        '.movie-card[data-id]',
        '.series-card[data-id]',
        '.music-card[data-id]',
        '.book-card[data-id]',
        '.list-card[data-id]'
    ].join(', ');

    document.querySelectorAll(cardSelector).forEach((card) => {
        const favoriteButton = card.querySelector('.btn-fav');

        if (!favoriteButton) {
            return;
        }

        favoriteButton.classList.toggle('active', isFavorite(card.dataset.id));
    });
}

export function getFavorites() {
    return getFavoritesFromStorage();
}

export async function syncFavoritesForUser(user) {
    if (!user) {
        writeFavorites([]);
        return [];
    }

    await ensureUserDocument(user);
    const syncedFavorites = (await getUserFavorites(user.uid)).filter(isFavoriteRecord);
    writeFavorites(syncedFavorites);
    return syncedFavorites;
}

export async function toggleFavorite(item, user = null) {
    const favorites = readFavorites();
    const existingFavorite = favorites.find(fav => String(fav.id) === String(item.id));
    const exists = Boolean(existingFavorite);
    const updated = exists
        ? favorites.filter(fav => String(fav.id) !== String(item.id))
        : [...favorites, item];

    writeFavorites(updated);

    if (user) {
        try {
            await ensureUserDocument(user);

            if (exists) {
                await removeUserFavorite(user.uid, existingFavorite);
            } else {
                await addUserFavorite(user.uid, item);
            }
        } catch (error) {
            writeFavorites(favorites);
            console.error('Failed to sync favorite with Firestore:', error);
            throw error;
        }
    }

    return updated;
}

export async function removeFromFavorites(id, user = null) {
    const favorites = readFavorites();
    const existingFavorite = favorites.find(item => String(item.id) === String(id));
    const updated = favorites.filter(item => String(item.id) !== String(id));

    writeFavorites(updated);

    if (user) {
        try {
            await ensureUserDocument(user);
            if (existingFavorite) {
                await removeUserFavorite(user.uid, existingFavorite);
            }
        } catch (error) {
            writeFavorites(favorites);
            console.error('Failed to remove favorite from Firestore:', error);
            throw error;
        }
    }

    return updated;
}
