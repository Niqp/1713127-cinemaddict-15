import CardPopupView from '../view/film-popup-view';
import { remove, replace, renderElement } from '../render';
import { RenderPosition } from '../const';

export default class PopupPresenter {
  constructor(updateFilm) {
    this.destroy = this.destroy.bind(this);
    this._handlePopupEscPress = this._handlePopupEscPress.bind(this);
    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handlePopupWatchedClick = this._handlePopupWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._handleNewCommentSend = this._handleNewCommentSend.bind(this);
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
    this.currentPopupComponent.setCloseButtonClickHandler(this.destroy);
    document.addEventListener('keydown',this._handlePopupEscPress);
    this.currentPopupComponent.setWatchlistHandler(this._handlePopupWatchlistClick);
    this.currentPopupComponent.setWatchedHandler(this._handlePopupWatchedClick);
    this.currentPopupComponent.setFavoriteHandler(this._handlePopupFavoriteClick);
    this.currentPopupComponent.setCommentSendHandler(this._handleNewCommentSend);
  }

  destroy() {
    remove(this.currentPopupComponent);
    this.currentPopupComponent = null;
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown',this._handlePopupEscPress);
  }

  updatePopup(film) {
    this.currentPopupComponent.updateState(film);
  }

  getCurrentY() {
    return this.currentPopupComponent.getElement().scrollTop;
  }

  setCurrentY(newY) {
    this.currentPopupComponent.getElement().scrollTo(0,newY);
  }

  _handlePopupEscPress(evt) {
    if (evt.key === 'Escape') {
      this.destroy();
    }
  }

  _handlePopupWatchlistClick(film) {
    this._updateFilm(
      Object.assign(
        {},
        film,
        {
          isInWatchlist: !film.isInWatchlist,
        },
      ),
    );
  }

  _handlePopupWatchedClick(film) {
    this._updateFilm(
      Object.assign(
        {},
        film,
        {
          isWatched: !film.isWatched,
        },
      ),
    );
  }

  _handlePopupFavoriteClick(film) {
    this._updateFilm(
      Object.assign(
        {},
        film,
        {
          isFavorite: !film.isFavorite,
        },
      ),
    );
  }

  _handleNewCommentSend(film) {
    this._updateFilm(film);
  }
}
