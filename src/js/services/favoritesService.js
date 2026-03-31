export function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(item => item.id === id);
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function toggleFavorite(item) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const exists = favorites.some(fav => fav.id === item.id);

    let updated;

    if (exists) {
        updated = favorites.filter(fav => fav.id !== item.id);
    } else {
        updated = [...favorites, item];
    }

    localStorage.setItem('favorites', JSON.stringify(updated));
}
export function removeFromFavorites(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const updated = favorites.filter(item => item.id !== id);

    localStorage.setItem('favorites', JSON.stringify(updated));
}