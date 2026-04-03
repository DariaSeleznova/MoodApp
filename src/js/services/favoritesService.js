import { ensureUserDocument, getUserFavorites, saveUserFavorites } from './userDataService.js';

const FAVORITES_STORAGE_KEY = 'favorites';

function readFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
}

function writeFavorites(favorites) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
    return readFavorites().some(item => item.id === id);
}

export function getFavorites() {
    return readFavorites();
}

export async function syncFavoritesForUser(user) {
    if (!user) {
        writeFavorites([]);
        return [];
    }

    await ensureUserDocument(user);
    const favorites = await getUserFavorites(user.uid);
    writeFavorites(favorites);
    return favorites;
}

export async function toggleFavorite(item, user = null) {
    const favorites = readFavorites();
    const exists = favorites.some(fav => fav.id === item.id);
    const updated = exists
        ? favorites.filter(fav => fav.id !== item.id)
        : [...favorites, item];

    writeFavorites(updated);

    if (user) {
        await ensureUserDocument(user);
        await saveUserFavorites(user.uid, updated);
    }

    return updated;
}

export async function removeFromFavorites(id, user = null) {
    const favorites = readFavorites();
    const updated = favorites.filter(item => item.id !== id);

    writeFavorites(updated);

    if (user) {
        await ensureUserDocument(user);
        await saveUserFavorites(user.uid, updated);
    }

    return updated;
}
