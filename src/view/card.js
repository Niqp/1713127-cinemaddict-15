import AbstractView from './abstract-view';
import CardPopupView from './card-popup';
import { renderElement } from '../render';

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

export default class Card extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._links = {
      poster: this.getElement().querySelector('.film-card__poster'),
      title: this.getElement().querySelector('.film-card__title'),
      comments: this.getElement().querySelector('.film-card__comments'),
    };
    this._popup = new CardPopupView(this._film);
  }

  getTemplate() {
    return getCardTemplate(this._film);
  }

  addClickHandler(position) {
    const onPopupClick = () => {
      const currentOpenPopup = document.querySelector('.film-details');
      const isSamePopup = currentOpenPopup === this._popup.getElement();
      if (!isSamePopup) {
        if (currentOpenPopup) {
          currentOpenPopup.remove();
        }
        renderElement(this._bodyElement,this._popup,position);
        this._popup.closeCurrentPopup();
        this._bodyElement.classList.add('hide-overflow');
      }
    };

    Object.entries(this._links).forEach((entry) => {
      entry[1].style.cursor = 'pointer';
      entry[1].addEventListener('click',onPopupClick);
    });
  }
}
