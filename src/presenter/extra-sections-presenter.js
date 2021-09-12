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
    this._getTopRated = this._getTopRated.bind(this);
    this._getMostCommented = this._getMostCommented.bind(this);
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._topRatedPresenters = new Map;
    this._mostCommentedPresenters = new Map;
    this._generatedTopRatedCount = 0;
    this._generatedMostCommentedCount = 0;
  }

  init() {
    this._films = this._filmsModel.films;
    if (this._films === null) {
      return;
    }
    this._topRatedComponent = this.initComponent(this._topRatedComponent,TopRatedSectionView,this._getTopRated);
    this._mostCommentedComponent = this.initComponent(this._mostCommentedComponent,MostCommentedSectionView,this._getMostCommented);
  }

  destroy() {
    this._filmPresenters.forEach((film) => film.destroy());
    this._filmPresenters.clear();
    this._removeComponent(this._topRatedComponent);
    this._removeComponent(this._mostCommentedComponent);
  }

  initComponent(component,view,getComponentFilms) {
    const filteredFilms = getComponentFilms(this._films);
    if (filteredFilms.length === 0) {
      this._removeComponent(component);
    }
    const oldComponent = component;
    component = new view;
    this._renderContainer(oldComponent,component);
    this._renderFilms(filteredFilms,component);
    return component;
  }

  _removeComponent(component) {
    if (component) {
      remove(component);
      component = null;
    }
  }

  _getTopRated(films) {
    this._topRatedFilms = getTopRatedMovies(films).slice(0,CardNumber.EXTRA_CARDS_TO_RENDER);
    return this._topRatedFilms.filter((film) => film.rating !== 0);
  }

  _getMostCommented(films) {
    this._mostCommentedFilms = getMostCommentedMovies(films).slice(0,CardNumber.EXTRA_CARDS_TO_RENDER);
    return this._mostCommentedFilms.filter((film) => film.comments.length !== 0);
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
}
