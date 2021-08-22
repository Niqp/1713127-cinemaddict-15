import CardPopupView from '../view/card-popup';
import { remove, replace, renderElement } from '../render';
import { RenderPosition } from '../const';

export default class PopupPresenter {
  constructor(updateFilm) {
    this.destroy = this.destroy.bind(this);
    this._handlePopupEscPress = this._handlePopupEscPress.bind(this);
    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handlePopupWatchedClick = this._handlePopupWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._updateFilm = updateFilm;
    this.currentPopupComponent = null;
    this._bodyElement = document.querySelector('body');

  }

  init(film) {
    this.film = film;
    const oldPopupComponent = this.currentPopupComponent;
    this.currentPopupComponent = new CardPopupView(this.film);
    this._bodyElement.classList.add('hide-overflow');
    if (oldPopupComponent === null) {
      renderElement(this._bodyElement,this.currentPopupComponent,RenderPosition.BEFOREEND);
      this._setPopupHandlers();
      return;
    }
    if (this._bodyElement.contains(oldPopupComponent.getElement())) {
      replace(this.currentPopupComponent, oldPopupComponent);
      this._setPopupHandlers();
      remove(oldPopupComponent);
    }
  }

  _setPopupHandlers() {
    this.currentPopupComponent.setClickHandler(this.destroy);
    document.addEventListener('keydown',this._handlePopupEscPress);
    this.currentPopupComponent.setWatchlistHandler(this._handlePopupWatchlistClick);
    this.currentPopupComponent.setWatchedHandler(this._handlePopupWatchedClick);
    this.currentPopupComponent.setFavoriteHandler(this._handlePopupFavoriteClick);
  }

  destroy() {
    remove(this.currentPopupComponent);
    this.currentPopupComponent = null;
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown',this._handlePopupEscPress);
  }

  _handlePopupEscPress(evt) {
    if (evt.key === 'Escape') {
      this.destroy();
    }
  }

  _handlePopupWatchlistClick() {
    this._updateFilm(
      Object.assign(
        {},
        this.film,
        {
          isInWatchlist: !this.film.isInWatchlist,
        },
      ),
    );
  }

  _handlePopupWatchedClick() {
    this._updateFilm(
      Object.assign(
        {},
        this.film,
        {
          isWatched: !this.film.isWatched,
        },
      ),
    );
  }

  _handlePopupFavoriteClick() {
    this._updateFilm(
      Object.assign(
        {},
        this.film,
        {
          isFavorite: !this.film.isFavorite,
        },
      ),
    );
  }
}
