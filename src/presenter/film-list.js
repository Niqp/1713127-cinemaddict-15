import FilmContainerView from '../view/film-container';
import FilmEmptyContainerView from '../view/empty-list';
import ButtonShowMore from '../view/button-show-more';
import SortMenu from '../view/menu-sort';
import FilmPresenter from './film-presenter';
import PopupPresenter from './film-popup-presenter';
import { RenderPosition, CardNumber, NoFilmsMessages, SortType, UserAction, UpdateType } from '../const';
import { renderElement, remove } from '../render';
import { filter, getNewestMovies, getTopRatedMovies} from '../filters';
import LoadingView from '../view/loading';

export default class FilmList {
  constructor(listContainer,filmsModel,commentsModel,filterModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._listContainer = listContainer;
    this._filmEmptyContainerComponent = null;
    this._sortMenu = null;
    this._showMoreButtonComponent = null;
    this._filmContainerComponent = null;
    this._currentPopup = null;
    this._filmPresenter = new Map;
    this._handlePopupAdd = this._handlePopupAdd.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmSorting = this._handleFilmSorting.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._mainElement = document.querySelector('.main');
    this._generatedCardsCount = 0;
    this._currentSortMethod = SortType.DEFAULT;
    this._loadingComponent = new LoadingView();
    this._isLoading = true;

  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._currentFilms = this._getFilms();
    if (this._isLoading === true) {
      this._renderLoading();
      return;
    }
    this._currentFilms = this._getFilms();
    this._renderSortMenu();
    this._renderFilmContainer();
    this._renderFilmList();
  }

  destroy() {
    this._clearFilms();
    this._generatedCardsCount = 0;
    remove(this._sortMenu);
    remove(this._filmContainerComponent);
    remove(this._loadingComponent);
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

  }

  _renderLoading() {
    renderElement(this._mainElement,this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _getFilms() {
    const filterType = this._filterModel.filter;
    const films = this._filmsModel.films;
    const filteredFilms = filter[filterType](films);
    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, update, comment) {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update, comment);
        // this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.REMOVE_COMMENT:
        this._commentsModel.removeComment(updateType, comment);
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.TOGGLE_PARAMETERS:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _popupModelUpdate(data) {
    if (this._currentPopup !== null) {
      if (this._currentPopup.component && this._currentPopup.component.currentId === data.id) {
        const savedY = this._currentPopup.currentY;
        this._currentPopup.updatePopup(UpdateType.PATCH,data);
        this._currentPopup.currentY = savedY;
      }
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.get(data.id).init(data);
        this._popupModelUpdate(data);
        break;
      case UpdateType.MINOR:{
        this._currentFilms = this._getFilms();
        this._popupModelUpdate(data);
        this._sortFilms(this._currentSortMethod);
        break;}
      case UpdateType.MAJOR:{
        this._currentFilms = this._getFilms();
        this._popupModelUpdate(data);
        this._clearFilmList();
        this._renderSortMenu();
        this._renderFilmContainer();
        this._renderFilmList();
        break;}
      case UpdateType.INIT:{
        this._currentFilms = this._getFilms();
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderSortMenu();
        this._renderFilmContainer();
        this._renderFilmList();
        break;
      }
    }
  }

  _renderSortMenu() {
    if (this._sortMenu !== null) {
      this._sortMenu = null;
    }
    this._sortMenu = new SortMenu();
    renderElement(this._listContainer,this._sortMenu,RenderPosition.BEFOREEND);
    this._sortMenu.setClickHandler(this._handleFilmSorting);
  }

  _renderFilmContainer() {
    if (this._filmContainerComponent !== null) {
      this._filmContainerComponent = null;
    }
    this._filmContainerComponent = new FilmContainerView();
    renderElement(
      this._listContainer,
      this._filmContainerComponent,
      RenderPosition.BEFOREEND);
  }

  _updateFilmList() {
    this._clearFilms();
    this._generatedCardsCount = 0;
    this._renderFilmList();
  }

  _clearFilmList() {
    this._clearFilms();
    this._generatedCardsCount = 0;
    remove(this._sortMenu);
    remove(this._filmContainerComponent);
    this._renderSortMenu;
    this._renderFilmContainer;
  }

  _sortFilms(type) {
    switch (type) {
      case SortType.DEFAULT:
        this._currentFilms = this._getFilms();
        this._updateFilmList();
        break;
      case SortType.RATING:
        this._currentFilms = getTopRatedMovies(this._getFilms());
        this._updateFilmList();
        break;
      case SortType.DATE:
        this._currentFilms = getNewestMovies(this._getFilms());
        this._updateFilmList();
        break;
    }
  }

  _handleFilmSorting(type) {
    if (this._currentSortMethod === type) {
      return;
    }
    this._currentSortMethod = type;
    this._sortFilms(type);
  }


  _renderFilmList(currentlyRenderedCount = CardNumber.CARDS_TO_RENDER) {
    if (this._currentFilms.length < 1) {
      const selectedFilter = this._filterModel.filter;
      this._renderFilmEmptyContainer(NoFilmsMessages[selectedFilter]);
      return;
    }
    if (this._currentFilms.length > currentlyRenderedCount) {
      this._renderShowMoreButton();
    }
    this._renderFilms(this._currentFilms,currentlyRenderedCount);
  }

  _renderFilm(film) {
    const currentFilm = new FilmPresenter(this._filmContainerComponent,this._handlePopupAdd,this._handleViewAction);
    this._filmPresenter.set(film.id,currentFilm);
    currentFilm.init(film);
  }

  _handlePopupAdd(filmId) {
    if (this._currentPopup === null) {
      this._currentPopup = new PopupPresenter(this._handleViewAction,this._commentsModel);
    }
    if (this._currentPopup.component) {
      if (this._currentPopup.component.currentId === filmId) {
        return;
      }
      this._currentPopup.destroy();
    }
    this._currentPopup.init(this._filmPresenter.get(filmId).film);
  }

  _renderFilms(films, cardNumber = CardNumber.CARDS_TO_RENDER) {
    const cardsToRender = Math.min((this._currentFilms.length-this._generatedCardsCount), cardNumber);
    for (let i = 0; i < cardsToRender; i++) {
      this._renderFilm(films[this._generatedCardsCount]);
      this._generatedCardsCount+=1;
    }
  }

  _clearFilms() {
    this._filmPresenter.forEach((film) => film.destroy());
    this._filmPresenter.clear();
    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
    if (this._filmEmptyContainerComponent) {
      remove(this._filmEmptyContainerComponent);
    }
  }

  _renderFilmEmptyContainer(message) {
    if (this._filmEmptyContainerComponent !== null) {
      this._filmEmptyContainerComponent = null;
    }
    this._filmEmptyContainerComponent = new FilmEmptyContainerView(message);
    renderElement(
      this._listContainer,
      this._filmEmptyContainerComponent,
      RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._currentFilms);
    if (this._generatedCardsCount >= this._currentFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ButtonShowMore();
    this._showMoreContainer = this._filmContainerComponent.getElement().querySelector('.films-list');
    renderElement(this._showMoreContainer,this._showMoreButtonComponent,RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }
}
