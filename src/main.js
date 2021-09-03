import ProfileView from './view/profile';
// import TopRatedSectionView from './view/film-top-rated';
// import MostCommentedSectionView from './view/film-most-commented';
import FilmsModel from './model/film-model';
import FooterStatsView from './view/footer-stats';
import Film from './mock/generate-film';
import Comment from './mock/generate-comments';
import { calculateRank } from './profile-rank';
import { ranks, RenderPosition, CardNumber, FilterType } from './const';
import { renderElement } from './render';
import FilmList from './presenter/film-list';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import FilterMenuPresenter from './presenter/filter-menu-presenter';
import { filter } from './filters';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');


const siteRender = () => {
  const filmsModel = new FilmsModel();
  const commentsModel = new CommentsModel();
  const filterModel = new FilterModel();

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
  const currentHistoryListMovies = filter[FilterType.HISTORY](filmsModel.films).length;
  if (currentHistoryListMovies >= 1) {
    renderElement(
      headerElement,
      new ProfileView(calculateRank(ranks, currentHistoryListMovies)),RenderPosition.BEFOREEND);
  }
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

  const filterMenu = new FilterMenuPresenter(mainElement,filterModel,filmsModel);
  const filmListPresenter = new FilmList(mainElement,filmsModel,commentsModel,filterModel);
  filterMenu.init();
  filmListPresenter.init();

};
siteRender();
