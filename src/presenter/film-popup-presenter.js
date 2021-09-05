import FilmPopupView from '../view/film-popup-view';
import { remove, replace, renderElement } from '../render';
import { RenderPosition, UpdateType, UserAction } from '../const';
import { createCurrentDate } from '../utils/utils';

export default class PopupPresenter {
  constructor(updateFilm,commentsModel) {
    this._commentsModel = commentsModel;
    this.destroy = this.destroy.bind(this);
    this._handlePopupEscPress = this._handlePopupEscPress.bind(this);
    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handlePopupWatchedClick = this._handlePopupWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._handleNewCommentSend = this._handleNewCommentSend.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._updateFilm = updateFilm;
    this._component = null;
    this._bodyElement = document.querySelector('body');

  }

  init(film) {
    this.film = film;
    this._generateComments(this.film);
    const oldPopupComponent = this._component;
    this._component = new FilmPopupView(this.film, this._comments);
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
    this._component.setCommentDeleteHandler(this._handleDeleteComment);
  }

  destroy() {
    remove(this._component);
    this._component = null;
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown',this._handlePopupEscPress);
  }

  updatePopup(film) {
    const currentY = this._component.getElement().scrollTop;
    this._generateComments(film);
    this._component.comments = this._comments;
    this._component.updateState(film);
    this._component.getElement().scrollTo(0,currentY);
  }

  get currentY() {
    return this._component.getElement().scrollTop;
  }

  set currentY(newY) {
    this._component.getElement().scrollTo(0,newY);
  }

  _generateComments(film) {
    this._comments = [];
    film.comments.forEach((comment) => {
      this._comments.push(this._commentsModel.comments.find((modelComment) => modelComment.id === comment));
    });

  }

  _handlePopupEscPress(evt) {
    if (evt.key === 'Escape') {
      this.destroy();
    }
  }

  _handlePopupWatchlistClick(film) {
    this._updateFilm(
      UserAction.TOGGLE_PARAMETERS,
      UpdateType.MINOR,
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
      UserAction.TOGGLE_PARAMETERS,
      UpdateType.MINOR,
      Object.assign(
        {},
        film,
        {
          isWatched: !film.isWatched,
          watchedDate: createCurrentDate(),
        },
      ),
    );
  }

  _handlePopupFavoriteClick(film) {
    this._updateFilm(
      UserAction.TOGGLE_PARAMETERS,
      UpdateType.MINOR,
      Object.assign(
        {},
        film,
        {
          isFavorite: !film.isFavorite,
        },
      ),
    );
  }

  _handleNewCommentSend(film,comment) {
    this._updateFilm(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      film,
      comment);
  }

  _handleDeleteComment(film,id) {
    this._updateFilm(
      UserAction.REMOVE_COMMENT,
      UpdateType.PATCH,
      film,
      id,
    );
  }
}
