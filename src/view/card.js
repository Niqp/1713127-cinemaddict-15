import { createElement } from '../utils.js';

const getCardTemplate = (film) => {
  const {poster, title, description, rating, year, duration, genres, comments, isInWatchlist, isWatched, isFavorite} = film;
  let shortDescription = description.join('');
  shortDescription = shortDescription.length > 140 ? `${shortDescription.slice(0,139)}...` : shortDescription;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isInWatchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${isFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class Card {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return getCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

