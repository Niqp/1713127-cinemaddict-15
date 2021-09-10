import TopRatedSectionView from '../view/film-top-rated';
import MostCommentedSectionView from '../view/film-most-commented';
import { CardNumber, RenderPosition } from '../const';
import { remove, renderElement, replace } from '../render';
import { getMostCommentedMovies, getTopRatedMovies } from '../filters';
import FilmPresenter from './film-presenter';

export default class ExtraSectionsPresenter {
  constructor(container, addPopup, updateFilm, filmsModel, filmPresenters) {
    this._container = container;
    this._addPopup = addPopup;
    this._updateFilm = updateFilm;
    this._filmsModel = filmsModel;
    this._filmPresenters = filmPresenters;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._topRatedPresenters = new Map;
    this._mostCommentedPresenters = new Map;
    this._generatedTopRatedCount = 0;
    this._generatedMostCommentedCount = 0;
  }

  init() {
    this._films = this._filmsModel.films;
    this.initTopRated(this._films);
    this.initMostCommented(this._films);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._filmPresenters.forEach((film) => film.destroy());
    this._filmPresenters.clear();
    this._removeTopRated();
    this._removeMostCommented();
    this._filmsModel.removeObserver(this._handleModelEvent);
  }

  initTopRated(films) {
    this._topRatedFilms = getTopRatedMovies(films).slice(0,CardNumber.EXTRA_CARDS_TO_RENDER);
    const filmsWithRating = this._topRatedFilms.filter((film) => film.rating !== 0);
    if (filmsWithRating.length === 0) {
      if (this._topRatedComponent) {
        this._removeTopRated();
      }
      return;
    }
    const oldTopRatedComponent = this._topRatedComponent;
    this._topRatedComponent = new TopRatedSectionView();
    this._renderContainer(oldTopRatedComponent,this._topRatedComponent);
    this._renderFilms(filmsWithRating,this._topRatedComponent);
  }

  initMostCommented(films) {
    this._mostCommentedFilms = getMostCommentedMovies(films).slice(0,CardNumber.EXTRA_CARDS_TO_RENDER);
    const filmsWithComments = this._mostCommentedFilms.filter((film) => film.comments.length !== 0);
    if (filmsWithComments.length === 0) {
      if (this._mostCommentedComponent) {
        this._removeMostCommented();
      }
      return;
    }
    const oldMostCommentedComponent = this._mostCommentedComponent;
    this._mostCommentedComponent = new MostCommentedSectionView();
    this._renderContainer(oldMostCommentedComponent,this._mostCommentedComponent);
    this._renderFilms(filmsWithComments,this._mostCommentedComponent);
  }

  _handleModelEvent() {
    this._films = this._filmsModel.films;
    this.initTopRated(this._films);
    this.initMostCommented(this._films);
  }

  _removeTopRated() {
    if (this._topRatedComponent) {
      remove(this._topRatedComponent);
      this._topRatedComponent = null;
    }
  }

  _removeMostCommented() {
    if (this._mostCommentedComponent) {
      remove(this._mostCommentedComponent);
      this._mostCommentedComponent = null;
    }
  }


  _renderContainer(oldComponent,component) {
    if (oldComponent === null) {
      renderElement(this._container,component,RenderPosition.BEFOREEND);
      return;
    }
    replace(component, oldComponent);
    remove(oldComponent);
  }

  _renderFilms(films,container) {
    const cardsToRender = Math.min(films.length, CardNumber.EXTRA_CARDS_TO_RENDER);
    for (let i = 0; i < cardsToRender; i++) {
      this._renderFilm(films[i],container);
    }
  }

  _renderFilm(film,container) {
    const currentFilm = new FilmPresenter(container,this._addPopup,this._updateFilm);
    this._filmPresenters.set(film.id,currentFilm);
    currentFilm.init(film);
  }

  // _clearFilms(presenter) {
  //   presenter.forEach((film) => film.destroy());
  //   presenter.clear();
  // }
}
