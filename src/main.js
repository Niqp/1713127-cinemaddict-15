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
import Api from './api';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');


const siteRender = () => {
  const api = new Api(Server.END_POINT,Server.AUTHORIZATION);
  const filmsModel = new FilmsModel(api);
  const commentsModel = new CommentsModel(api,filmsModel);
  const filterModel = new FilterModel();
  const siteStateModel = new SiteStateModel();
  const rankModel = new RankModel();

  // const renderedCards = new Array(CardNumber.CARDS_TO_GENERATE)
  //   .fill()
  //   .map(() => new Film());
  // const generatedComments = [];
  // renderedCards.forEach((film) => {
  //   film.comments.forEach((id) => generatedComments.push(new Comment(id)));
  // });

  // const currentTopRatedMovies = getTopRatedMovies(renderedCards);
  // const currentMostCommentedMovies = getMostCommentedMovies(renderedCards);

  // commentsModel.comments = generatedComments;
  // filmsModel.films = renderedCards;

  const rankPresenter = new RankPresenter(headerElement,rankModel,filmsModel);
  const footerStats = new FooterStatsView();
  rankPresenter.init();
  renderElement(
    footerElement,
    footerStats,
    RenderPosition.BEFOREEND);

  //   const renderExtraSection = (template, cards) => {
  //     const currentSection = new template(cards,false);
  //     renderElement(
  //       films,
  //       currentSection,
  //       RenderPosition.BEFOREEND);
  //     currentSection.renderCards();
  //   };

  //   renderExtraSection(MostCommentedSectionView, currentTopRatedMovies);
  //   renderExtraSection(TopRatedSectionView, currentMostCommentedMovies);
  // };
  const filmListPresenter = new FilmList(mainElement,filmsModel,commentsModel,filterModel,api);
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

  filmsModel.fetchFilms().then(() => footerStats.updateElement(filmsModel.films));
};
siteRender();

