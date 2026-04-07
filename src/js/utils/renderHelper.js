import { isFavorite } from "./favoritesStorage";

export function renderFavoriteButton(id) {
    return `
        <button class="btn-fav ${isFavorite(id) ? 'active' : ''}">
            <svg class="heart" viewBox="0 0 32 32">
                <path d="M16,28.261c-0.757,0-1.515-0.289-2.094-0.868C9.575,23.111,1,17.159,1,11.205c0-4.048,3.284-7.332,7.332-7.332 c2.316,0,4.484,1.085,5.889,2.894l1.779,2.264l1.779-2.264c1.405-1.809,3.573-2.894,5.889-2.894C27.716,3.873,31,7.157,31,11.205 c0,5.954-8.575,11.906-12.906,16.188C17.515,27.972,16.757,28.261,16,28.261z"/>
            </svg>
        </button>
    `;
}

export function renderImage(imageUrl, alt, placeholder) {
    return `
        <div class="list-card__image">
            ${imageUrl
            ? `<img src="${imageUrl}" alt="${alt}" />`
            : `<div class="list-card__placeholder">${placeholder}</div>`
        }
        </div>
    `;
}
export function renderTrailerButton(trailerUrl) {
    if (!trailerUrl) return '';

    return `<button class="btn btn-primary btn-trailer" data-i18n="trailer"></button>`;
}