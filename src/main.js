// import TopRatedSectionView from './view/film-top-rated';
// import MostCommentedSectionView from './view/film-most-commented';
import FilmsModel from './model/film-model';
import FooterStatsView from './view/footer-stats';
import Film from './mock/generate-film';
import Comment from './mock/generate-comments';
import { RenderPosition, CardNumber, StateType } from './const';
import { renderElement } from './render';
import FilmList from './presenter/film-list';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import FilterMenuPresenter from './presenter/filter-menu-presenter';
import SiteStateModel from './model/site-state-model';
import RankModel from './model/rank-model';
import RankPresenter from './presenter/rank-presenter';
import StatsPresenter from './presenter/stats-presenter';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');


const siteRender = () => {
  const filmsModel = new FilmsModel();
  const commentsModel = new CommentsModel();
  const filterModel = new FilterModel();
  const siteStateModel = new SiteStateModel();
  const rankModel = new RankModel();

  const renderedCards = new Array(CardNumber.CARDS_TO_GENERATE)
    .fill()
    .map(() => new Film());
  const generatedComments = [];
  renderedCards.forEach((film) => {
    film.comments.forEach((id) => generatedComments.push(new Comment(id)));
  });
  // const currentTopRatedMovies = getTopRatedMovies(renderedCards);
  // const currentMostCommentedMovies = getMostCommentedMovies(renderedCards);
  commentsModel.comments = generatedComments;
  filmsModel.films = renderedCards;
  const rankPresenter = new RankPresenter(headerElement,rankModel,filmsModel);
  rankPresenter.init();
  renderElement(
    footerElement,
    new FooterStatsView(renderedCards),
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
  filterMenu.init();
  filmListPresenter.init();

};
siteRender();
