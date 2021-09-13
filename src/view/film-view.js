import { DateFormats } from '../const';
import { formatDate, createDurationMinutes } from '../utils/utils';
import AbstractView from './abstract-view';

const getCardTemplate = (film) => {
  const {poster, title, description, rating, releaseDate, duration, genres, comments, isInWatchlist, isWatched, isFavorite} = film;
  const shortDescription = description.length > 140 ? `${description.slice(0,139)}...` : description;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatDate(releaseDate,DateFormats.TO_YEAR)}</span>
      <span class="film-card__duration">${formatDate(createDurationMinutes(duration),DateFormats.HOURS_AND_MINUTES)}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src="/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isInWatchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${isFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class Card extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._links = {
      poster: this.getElement().querySelector('.film-card__poster'),
      title: this.getElement().querySelector('.film-card__title'),
      comments: this.getElement().querySelector('.film-card__comments'),
    };
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistHandler = this._watchlistHandler.bind(this);
    this._watchedHandler = this._watchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._buttons = {
      watchlist: this.getElement().querySelector('.film-card__controls-item--add-to-watchlist'),
      watched: this.getElement().querySelector('.film-card__controls-item--mark-as-watched'),
      favorite: this.getElement().querySelector('.film-card__controls-item--favorite'),
    };
  }

  getTemplate() {
    return getCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistChange();
  }

  _watchedHandler(evt) {
    evt.preventDefault();
    this._callback.watchedChange();
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange();
  }


  setClickHandler(callback) {
    this._callback.click = callback;
    Object.entries(this._links).forEach((entry) => {
      const entryValue = entry[1];
      entryValue.style.cursor = 'pointer';
      entryValue.addEventListener('click',this._clickHandler);
    });
  }

  setWatchlistHandler(callback) {
    this._callback.watchlistChange = callback;
    this._buttons.watchlist.style.cursor = 'pointer';
    this._buttons.watchlist.addEventListener('click',this._watchlistHandler);
  }

  setWatchedHandler(callback) {
    this._callback.watchedChange = callback;
    this._buttons.watched.style.cursor = 'pointer';
    this._buttons.watched.addEventListener('click',this._watchedHandler);
  }

  setFavoriteHandler(callback) {
    this._callback.favoriteChange = callback;
    this._buttons.favorite.style.cursor = 'pointer';
    this._buttons.favorite.addEventListener('click',this._favoriteHandler);
  }
}
