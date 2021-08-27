import FilmContainerView from '../view/film-container';
import FilmEmptyContainerView from '../view/empty-list';
import ButtonShowMore from '../view/button-show-more';
import SortMenu from '../view/menu-sort';
import FilmPresenter from './film-presenter';
import PopupPresenter from './film-popup-presenter';
import { RenderPosition, CardNumber, NoFilmsMessages, SortType } from '../const';
import { renderElement, remove } from '../render';
import { updateItem } from '../utils';
import { getNewestMovies, getTopRatedMovies } from '../filters';

export default class FilmList {
  constructor(listContainer) {
    this._listContainer = listContainer;
    this._filmContainerComponent = new FilmContainerView();
    this._filmEmptyContainerComponent = new FilmEmptyContainerView();
    this._showMoreButtonComponent = new ButtonShowMore();
    this._sortMenu = new SortMenu();
    this._filmPresenter = new Map;
    this._handlePopupAdd = this._handlePopupAdd.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmUpdate = this._handleFilmUpdate.bind(this);
    this._handleFilmSorting = this._handleFilmSorting.bind(this);
    this._generatedCardsCount = 0;
    this._currentSortMethod = SortType.DEFAULT;
  }

  init(films) {
    this._films = films.slice();
    this._currentFilmOrder = this._films;
    this._currentPopup = new PopupPresenter(this._handleFilmUpdate);
    this._renderSortMenu();
    this._renderFilmList();
  }

  _renderSortMenu() {
    renderElement(this._listContainer,this._sortMenu,RenderPosition.BEFOREEND);
    this._sortMenu.setClickHandler(this._handleFilmSorting);
  }

  _sortFilms(films) {
    this._clearFilms();
    if (this._currentFilmOrder.length > CardNumber.CARDS_TO_RENDER) {
      this._renderShowMoreButton();
    }
    this._renderFilms(films);
  }

  _handleFilmSorting(type) {
    if (this._currentSortMethod === type) {
      return;
    }
    this._currentSortMethod = type;
    switch (type) {
      case SortType.DEFAULT:
        this._currentFilmOrder = this._films;
        this._sortFilms(this._currentFilmOrder);
        break;
      case SortType.RATING:
        this._currentFilmOrder = getTopRatedMovies(this._films);
        this._sortFilms(this._currentFilmOrder);
        break;
      case SortType.DATE:
        this._currentFilmOrder = getNewestMovies(this._films);
        this._sortFilms(this._currentFilmOrder);
        break;
    }
  }

  _renderFilmList() {
    if (this._films.length < 1) {
      this._renderFilmEmptyContainer();
      return;
    }
    if (this._currentFilmOrder.length > CardNumber.CARDS_TO_RENDER) {
      this._renderShowMoreButton();
    }
    this._renderSortMenu();
    renderElement(
      this._listContainer,
      this._filmContainerComponent,
      RenderPosition.BEFOREEND);
    this._renderFilms(this._currentFilmOrder);
  }

  _renderFilm(film) {
    const currentFilm = new FilmPresenter(this._filmContainerComponent,this._handlePopupAdd,this._handleFilmUpdate);
    this._filmPresenter.set(film.id,currentFilm);
    currentFilm.init(film);
  }

  _handlePopupAdd(filmId) {
    if (this._currentPopup.component) {
      if (this._currentPopup.component.currentId === filmId) {
        return;
      }
      this._currentPopup.destroy();
    }

    this._currentPopup.init(this._filmPresenter.get(filmId).film);
  }

  _renderFilms(films) {
    const cardsToRender = Math.min((CardNumber.CARDS_TO_GENERATE-this._generatedCardsCount), CardNumber.CARDS_TO_RENDER);
    for (let i = 0; i < cardsToRender; i++) {
      this._renderFilm(films[this._generatedCardsCount]);
      this._generatedCardsCount+=1;
    }
  }

  _clearFilms() {
    this._filmPresenter.forEach((film) => film.destroy());
    this._filmPresenter.clear();
    this._generatedCardsCount = 0;
    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmUpdate(updatedFilm) {
    this._films = updateItem(this._films,updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
    if (this._currentPopup.component && this._currentPopup.component.currentId === updatedFilm.id) {
      const savedY = this._currentPopup.currentY;
      this._currentPopup.updatePopup(updatedFilm);
      this._currentPopup.currentY = savedY;

    }
  }

  _renderFilmEmptyContainer() {
    renderElement(
      this._listContainer,
      new FilmEmptyContainerView(NoFilmsMessages.NO_MOVIES),
      RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._currentFilmOrder);
    if (this._generatedCardsCount >= this._films.length && this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    this._showMoreContainer = this._filmContainerComponent.getElement().querySelector('.films-list');
    renderElement(this._showMoreContainer,this._showMoreButtonComponent,RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
