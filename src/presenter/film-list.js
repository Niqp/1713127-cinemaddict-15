import FilmContainerView from '../view/film-container';
import FilmEmptyContainerView from '../view/empty-list';
import ButtonShowMore from '../view/button-show-more';
import SortMenu from '../view/menu-sort';
import FilmPresenter from './film-presenter';
import PopupPresenter from './film-popup-presenter';
import { RenderPosition, CardNumber, NoFilmsMessages, SortType, UserAction, UpdateType, ViewState } from '../const';
import { renderElement, remove } from '../render';
import { filter, getNewestMovies, getTopRatedMovies} from '../filters';
import LoadingView from '../view/loading';
import ExtraSectionsPresenter from './extra-sections-presenter';

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
    this._extraSections = null;
    this._filmPresenters = new Map;
    this._extraFilmPresenters = new Map;
    this._handlePopupAdd = this._handlePopupAdd.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmSorting = this._handleFilmSorting.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._generatedFilmsCount = 0;
    this._currentSortMethod = SortType.DEFAULT;
    this._loadingComponent = new LoadingView();
    this._isLoading = true;

  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._currentFilms = this._getFilteredFilms();
    if (this._isLoading === true) {
      this._renderLoading();
      return;
    }
    this._currentFilms = this._getFilteredFilms();
    this._renderSortMenu();
    this._renderFilmContainer();
    this._renderFilmList();
    this._renderExtraSections();
  }

  destroy() {
    this._clearFilms();
    this._generatedFilmsCount = 0;
    remove(this._sortMenu);
    remove(this._filmContainerComponent);
    remove(this._loadingComponent);
    this._extraSections.destroy();
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

  }

  _renderLoading() {
    renderElement(this._listContainer,this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _getFilteredFilms() {
    const filterType = this._filterModel.filter;
    const films = this._filmsModel.films;
    const filteredFilms = filter[filterType](films);
    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, update, comment) {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._currentPopup.setViewState(ViewState.SAVING);
        this._commentsModel.addComment(updateType, update, comment)
          .catch(() => {
            this._currentPopup.setAborting(comment);
          });
        break;
      case UserAction.REMOVE_COMMENT:
        this._currentPopup.setViewState(ViewState.DELETING,comment);
        this._commentsModel.removeComment(updateType, comment)
          .then(() => {
            this._filmsModel.updateFilm(updateType, update);
          })
          .catch(() => {
            this._currentPopup.setCommentAborting(comment);
          });
        break;
      case UserAction.TOGGLE_PARAMETERS:
        this._filmsModel.updateFilm(updateType, update)
          .catch(() => {
            if (this._currentPopup !== null && this._currentPopup.component) {
              this._currentPopup.setAborting();
              return;
            }
            const filmPresenter = this._filmPresenters.get(update.id);
            if (filmPresenter) {
              filmPresenter.setAborting();
            }
            const extraFilmPresenter = this._extraFilmPresenters.get(update.id);
            if (extraFilmPresenter) {
              extraFilmPresenter.setAborting();
            }
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:{
        const filmPresenter = this._filmPresenters.get(data.id);
        if (filmPresenter) {
          filmPresenter.init(data);
        }
        const extraFilmPresenter = this._extraFilmPresenters.get(data.id);
        if (extraFilmPresenter) {
          extraFilmPresenter.init(data);
        }
        this._popupModelUpdate(data);
        this._extraSections.destroy();
        this._renderExtraSections();
        break;}
      case UpdateType.MINOR:{
        this._currentFilms = this._getFilteredFilms();
        this._popupModelUpdate(data);
        this._sortFilms(this._currentSortMethod,true);
        this._extraSections.destroy();
        this._renderExtraSections();
        break;}
      case UpdateType.MAJOR:{
        this._currentFilms = this._getFilteredFilms();
        this._currentSortMethod = SortType.DEFAULT;
        this._popupModelUpdate(data);
        this._clearFilmList();
        this._extraSections.destroy();
        this._renderSortMenu();
        this._renderFilmContainer();
        this._renderFilmList();
        this._renderExtraSections();
        break;}
      case UpdateType.INIT:{
        this._currentFilms = this._getFilteredFilms();
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderSortMenu();
        this._renderFilmContainer();
        this._renderFilmList();
        this._renderExtraSections();
        break;
      }
    }
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
    const currentFilm = this._filmsModel.films.find((film) => film.id === filmId);
    this._currentPopup.init(currentFilm);
  }

  _popupModelUpdate(data) {
    if (this._currentPopup !== null) {
      if (this._currentPopup.component && this._currentPopup.component.currentId === data.id) {
        const savedY = this._currentPopup.currentY;
        this._currentPopup.updatePopup(data);
        this._currentPopup.currentY = savedY;
      }
    }
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

  _renderExtraSections() {
    if (this._extraSections !== null) {
      this._extraSections = null;
    }
    this._extraSections = new ExtraSectionsPresenter(this._filmContainerComponent,this._handlePopupAdd,this._handleViewAction, this._filmsModel, this._extraFilmPresenters);
    this._extraSections.init();
  }

  _renderFilmList(currentlyRenderedCount = CardNumber.CARDS_TO_RENDER) {
    if (this._currentFilms === null) {
      remove(this._sortMenu);
      remove(this._filmContainerComponent);
      this._renderFilmEmptyContainer(NoFilmsMessages.SERVER_ERROR);
      return;
    }
    if (this._currentFilms.length < 1) {
      const selectedFilter = this._filterModel.filter;
      remove(this._sortMenu);
      remove(this._filmContainerComponent);
      this._renderFilmEmptyContainer(NoFilmsMessages[selectedFilter]);
      return;
    }
    if (this._currentFilms.length > currentlyRenderedCount) {
      this._renderShowMoreButton();
    }
    this._renderFilms(this._currentFilms,this._filmContainerComponent,currentlyRenderedCount);
  }

  _updateFilmList(rememberShown) {
    this._clearFilms();
    const currentlyShownFilms = this._generatedFilmsCount;
    this._generatedFilmsCount = 0;
    this._renderFilmList(rememberShown ? currentlyShownFilms : CardNumber.CARDS_TO_RENDER);
  }

  _clearFilmList() {
    this._clearFilms();
    this._generatedFilmsCount = 0;
    remove(this._sortMenu);
    remove(this._filmContainerComponent);
    this._renderSortMenu;
    this._renderFilmContainer;
  }

  _renderFilms(films, container, cardNumber = CardNumber.CARDS_TO_RENDER) {
    const cardsToRender = Math.min((this._currentFilms.length-this._generatedFilmsCount), cardNumber);
    for (let i = 0; i < cardsToRender; i++) {
      this._renderFilm(films[this._generatedFilmsCount],container);
      this._generatedFilmsCount+=1;
    }
  }

  _renderFilm(film,container) {
    const currentFilm = new FilmPresenter(container,this._handlePopupAdd,this._handleViewAction);
    this._filmPresenters.set(film.id,currentFilm);
    currentFilm.init(film);
  }

  _clearFilms() {
    this._filmPresenters.forEach((film) => film.destroy());
    this._filmPresenters.clear();
    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }
    if (this._filmEmptyContainerComponent) {
      remove(this._filmEmptyContainerComponent);
    }
  }

  _sortFilms(type,rememberShown) {
    switch (type) {
      case SortType.DEFAULT:
        this._currentFilms = this._getFilteredFilms();
        this._updateFilmList(rememberShown);
        break;
      case SortType.RATING:
        this._currentFilms = getTopRatedMovies(this._getFilteredFilms());
        this._updateFilmList(rememberShown);
        break;
      case SortType.DATE:
        this._currentFilms = getNewestMovies(this._getFilteredFilms());
        this._updateFilmList(rememberShown);
        break;
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


  _handleFilmSorting(type) {
    if (this._currentSortMethod === type) {
      return;
    }
    this._currentSortMethod = type;
    this._sortFilms(type,false);
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

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ButtonShowMore();
    this._showMoreContainer = this._filmContainerComponent.getElement().querySelector('.films-list');
    renderElement(this._showMoreContainer,this._showMoreButtonComponent,RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._currentFilms,this._filmContainerComponent);
    if (this._generatedFilmsCount >= this._currentFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

}
