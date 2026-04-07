const FAVORITES_STORAGE_KEY = 'favorites';

export function readFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
}

export function writeFavoritesToStorage(favorites) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

function normalizeId(id) {
    return String(id);
}

export function isFavorite(id) {
    const normalizedId = normalizeId(id);
    return readFavorites().some(item => normalizeId(item.id) === normalizedId);
}

export function getFavoritesFromStorage() {
    return readFavorites();
}
