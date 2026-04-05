const FAVORITES_STORAGE_KEY = 'favorites';

export function readFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
}

export function writeFavoritesToStorage(favorites) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
    return readFavorites().some(item => item.id === id);
}

export function getFavoritesFromStorage() {
    return readFavorites();
}
