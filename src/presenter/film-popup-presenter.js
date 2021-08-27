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
    this._component = null;
    this._bodyElement = document.querySelector('body');

  }

  init(film) {
    this.film = film;
    const oldPopupComponent = this._component;
    this._component = new CardPopupView(this.film);
    this._bodyElement.classList.add('hide-overflow');
    if (oldPopupComponent === null) {
      renderElement(this._bodyElement,this._component,RenderPosition.BEFOREEND);
      this._setPopupHandlers();
      return;
    }
    if (this._bodyElement.contains(oldPopupComponent.getElement())) {
      replace(this._component, oldPopupComponent);
      this._setPopupHandlers();
      remove(oldPopupComponent);
    }
  }

  get component () {
    return this._component;
  }

  _setPopupHandlers() {
    this._component.setCloseButtonClickHandler(this.destroy);
    document.addEventListener('keydown',this._handlePopupEscPress);
    this._component.setWatchlistHandler(this._handlePopupWatchlistClick);
    this._component.setWatchedHandler(this._handlePopupWatchedClick);
    this._component.setFavoriteHandler(this._handlePopupFavoriteClick);
    this._component.setCommentSendHandler(this._handleNewCommentSend);
  }

  destroy() {
    remove(this._component);
    this._component = null;
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown',this._handlePopupEscPress);
  }

  updatePopup(film) {
    this._component.updateState(film);
  }

  get currentY() {
    return this._component.getElement().scrollTop;
  }

  set currentY(newY) {
    this._component.getElement().scrollTo(0,newY);
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
