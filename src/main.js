// import TopRatedSectionView from './view/film-top-rated';
// import MostCommentedSectionView from './view/film-most-commented';
import FilmsModel from './model/film-model';
import FooterStatsView from './view/footer-stats';
import { RenderPosition, StateType, Server, FilterType } from './const';
import { renderElement } from './render';
import FilmList from './presenter/film-list';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import FilterMenuPresenter from './presenter/filter-menu-presenter';
import SiteStateModel from './model/site-state-model';
import RankModel from './model/rank-model';
import RankPresenter from './presenter/rank-presenter';
import StatsPresenter from './presenter/stats-presenter';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');


const siteRender = () => {
  const STORE_PREFIX = 'taskmanager-localstorage';
  const STORE_VER = 'v15';
  const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

  const api = new Api(Server.END_POINT,Server.AUTHORIZATION);
  const localStore = new Store(STORE_NAME,window.localStorage);
  const apiWithProvider = new Provider(api,localStore);
  const filmsModel = new FilmsModel(apiWithProvider);
  const commentsModel = new CommentsModel(api,filmsModel);
  const filterModel = new FilterModel();
  const siteStateModel = new SiteStateModel();
  const rankModel = new RankModel();

  const rankPresenter = new RankPresenter(headerElement,rankModel,filmsModel);
  const footerStats = new FooterStatsView();
  rankPresenter.init();
  renderElement(
    footerElement,
    footerStats,
    RenderPosition.BEFOREEND);

  const filmListPresenter = new FilmList(mainElement,filmsModel,commentsModel,filterModel);
  const statsPresenter = new StatsPresenter(mainElement,filmsModel,rankModel);
  const handleSiteStateChange = (updateType,state) => {
    switch (state) {
      case StateType.STATS:
        filmListPresenter.destroy();
        statsPresenter.init();
        break;
      case StateType.FILMS:
        statsPresenter.destroy();
        filmListPresenter.init();
        break;
    }
  };
  siteStateModel.addObserver(handleSiteStateChange);
  const filterMenu = new FilterMenuPresenter(mainElement,filterModel,filmsModel,siteStateModel);
  filterMenu.init(FilterType.DISABLED);
  filmListPresenter.init();

  filmsModel.fetchFilms()
    .then(() => footerStats.updateElement(filmsModel.films))
    .catch(() => filmsModel.films = null);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
  window.addEventListener('online', () => {
    document.title = document.title.replace(' [offline]', '');
    apiWithProvider.syncFilms();
  });

  window.addEventListener('offline', () => {
    document.title += ' [offline]';
  });
};
siteRender();

