import CardView from '../view/film-view';
import { RenderPosition, UpdateType, UserAction } from '../const';
import { remove, replace, renderElement } from '../render';
import { createCurrentDate, shake } from '../utils/utils';

export default class FilmPresenter {
  constructor(filmContainer, addPopup, updateFilm) {
    this._currentFilmComponent = null;
    this._filmContainer = filmContainer;
    this._filmContainerSelector = this._filmContainer.getElement().querySelector('.films-list__container');
    this._addPopup = addPopup;
    this._updateFilm = updateFilm;
    this._handleFilmClick = this._handleFilmClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this.film = film;
    const previousFilmComponent = this._currentFilmComponent;
    this._currentFilmComponent = new CardView(this.film);
    if (previousFilmComponent === null) {
      renderElement(
        this._filmContainerSelector,
        this._currentFilmComponent,
        RenderPosition.BEFOREEND);
      this._setHandlers();
      return;
    }

    if (this._filmContainer.getElement().contains(previousFilmComponent.getElement())) {
      replace(this._currentFilmComponent, previousFilmComponent);
      this._setHandlers();
    }

    remove(previousFilmComponent);
  }

  destroy() {
    remove(this._currentFilmComponent);
  }

  setAborting() {
    shake(this._currentFilmComponent.getElement());
  }

  _setHandlers() {
    this._currentFilmComponent.setClickHandler(this._handleFilmClick);
    this._currentFilmComponent.setWatchlistHandler(this._handleWatchlistClick);
    this._currentFilmComponent.setWatchedHandler(this._handleWatchedClick);
    this._currentFilmComponent.setFavoriteHandler(this._handleFavoriteClick);
  }

  _handleFilmClick() {
    this._addPopup(this.film.id);
  }

  _handleWatchlistClick() {
    this._updateFilm(
      UserAction.TOGGLE_PARAMETERS,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.film,
        {
          isInWatchlist: !this.film.isInWatchlist,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._updateFilm(
      UserAction.TOGGLE_PARAMETERS,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.film,
        {
          isWatched: !this.film.isWatched,
          watchedDate: createCurrentDate(),
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._updateFilm(
      UserAction.TOGGLE_PARAMETERS,
      UpdateType.MINOR,
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
