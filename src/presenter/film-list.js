import FilmContainerView from '../view/card-container';
import FilmEmptyContainerView from '../view/empty-list';
import ButtonShowMore from '../view/button-show-more';
import SortMenu from '../view/menu-sort';
import CardPopupView from '../view/card-popup';
import FilmPresenter from './film';
import { RenderPosition, Cards, NoFilmsMessages } from '../const';
import { renderElement, remove, replace } from '../render';
import { updateItem } from '../utils';

export default class FilmList {
  constructor(listContainer) {
    this._listContainer = listContainer;
    this._filmContainerComponent = new FilmContainerView();
    this._filmEmptyContainerComponent = new FilmEmptyContainerView();
    this._sortMenu = new SortMenu();
    this._showMoreButtonComponent = new ButtonShowMore();
    this._filmPresenter = new Map;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handlePopupAdd = this._handlePopupAdd.bind(this);
    this._handlePopupRemove = this._handlePopupRemove.bind(this);
    this._handlePopupEscPress = this._handlePopupEscPress.bind(this);
    this._handleFilmUpdate = this._handleFilmUpdate.bind(this);
    this._handlePopupWatchlistClick = this._handlePopupWatchlistClick.bind(this);
    this._handlePopupWatchedClick = this._handlePopupWatchedClick.bind(this);
    this._handlePopupFavoriteClick = this._handlePopupFavoriteClick.bind(this);
    this._generatedCardsCount = 0;
    this._bodyElement = document.querySelector('body');
  }

  init(films) {
    this._films = films.slice();
    this._renderFilmList();
  }

  _renderFilmList() {
    if (this._films.length < 1) {
      this._renderFilmEmptyContainer();
      return;
    }
    if (this._generatedCardsCount < this._films.length) {
      this._renderShowMoreButton();
    }
    renderElement(
      this._listContainer,
      this._filmContainerComponent,
      RenderPosition.BEFOREEND);
    this._renderFilms();
  }

  _renderFilm(film) {
    const currentFilm = new FilmPresenter(this._filmContainerComponent,this._handlePopupAdd,this._handleFilmUpdate);
    this._filmPresenter.set(film.id,currentFilm);
    currentFilm.init(film);
  }

  _handlePopupAdd(filmId) {
    if (this._currentPopup) {
      if (this._currentPopup.film.id === filmId) {
        return;
      }
      remove(this._currentPopup);
      this._currentPopup = null;
    }

    this._renderPopup(filmId);
  }

  _renderPopup(filmId) {
    this._currentPopup = new CardPopupView(this._filmPresenter.get(filmId).film,this._handleFilmUpdate);
    renderElement(this._bodyElement,this._currentPopup,RenderPosition.BEFOREEND);
    this._addPopupHandlers();
  }

  _updatePopup(updatedFilm) {
    const oldPopup = this._currentPopup;
    this._currentPopup = new CardPopupView(updatedFilm, this._handleFilmUpdate);
    replace(this._currentPopup, oldPopup);
    this._addPopupHandlers();
  }

  _addPopupHandlers() {
    this._currentPopup.setClickHandler(this._handlePopupRemove);
    document.addEventListener('keydown',this._handlePopupEscPress);
    this._currentPopup.setWatchlistHandler(this._handlePopupWatchlistClick);
    this._currentPopup.setWatchedHandler(this._handlePopupWatchedClick);
    this._currentPopup.setFavoriteHandler(this._handlePopupFavoriteClick);
  }

  _handlePopupRemove() {
    remove(this._currentPopup);
    this._currentPopup = null;
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown',this._handlePopupRemove);
  }

  _handlePopupEscPress(evt) {
    if (evt.key === 'Escape') {
      this._handlePopupRemove();
    }
  }

  _handlePopupWatchlistClick(film) {
    this._handleFilmUpdate(
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
    this._handleFilmUpdate(
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
    this._handleFilmUpdate(
      Object.assign(
        {},
        film,
        {
          isFavorite: !film.isFavorite,
        },
      ),
    );
  }

  _renderFilms() {
    const cardsToRender = Math.min((Cards.CARDS_TO_GENERATE-this._generatedCardsCount), Cards.CARDS_TO_RENDER);
    for (let i = 0; i < cardsToRender; i++) {
      this._renderFilm(this._films[this._generatedCardsCount]);
      this._generatedCardsCount+=1;
    }
  }

  _handleFilmUpdate(updatedFilm) {
    this._films = updateItem(this._films,updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
    if (this._currentPopup && this._currentPopup.film.id === updatedFilm.id) {
      this._updatePopup(updatedFilm);
    }
  }

  _renderFilmEmptyContainer() {
    renderElement(
      this._listContainer,
      new FilmEmptyContainerView(NoFilmsMessages.NO_MOVIES),
      RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms();
    if (this._generatedCardsCount >= this._films.length && this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    this._showMoreButtonElement = this._showMoreButtonComponent.getElement();
    this._showMoreContainer = this._filmContainerComponent.getElement().querySelector('.films-list');
    renderElement(this._showMoreContainer,this._showMoreButtonComponent,RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
