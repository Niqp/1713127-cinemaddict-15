import MainMenuView from './view/menu';
import ProfileView from './view/profile';
// import TopRatedSectionView from './view/card-top-rated';
// import MostCommentedSectionView from './view/card-most-commented';
import FilmsModel from './model/film-model';
import FooterStatsView from './view/footer-stats';
import Film from './mock/generate-film';
import { calculateRank } from './profile-rank';
import { ranks, RenderPosition, CardNumber } from './const';
import { getWatchlistMovies,getHistoryListMovies,getFavoriteMovies} from './filters';
import { renderElement } from './render';
import FilmList from './presenter/film-list';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

const siteRender = () => {
  const filmsModel = new FilmsModel();
  const renderedCards = new Array(CardNumber.CARDS_TO_GENERATE)
    .fill()
    .map((item) => new Film(item));
  // const currentTopRatedMovies = getTopRatedMovies(renderedCards);
  // const currentMostCommentedMovies = getMostCommentedMovies(renderedCards);
  filmsModel.films = renderedCards;
  const currentWatchlistMovies = getWatchlistMovies(renderedCards);
  const currentHistoryListMovies = getHistoryListMovies(renderedCards);
  const currentFavoriteMovies = getFavoriteMovies(renderedCards);

  if (currentHistoryListMovies.length >= 1) {
    renderElement(
      headerElement,
      new ProfileView(calculateRank(ranks, currentHistoryListMovies)),RenderPosition.BEFOREEND);
  }
  renderElement(
    footerElement,
    new FooterStatsView(renderedCards),
    RenderPosition.BEFOREEND);
  renderElement(
    mainElement,
    new MainMenuView(
      currentWatchlistMovies,
      currentHistoryListMovies,
      currentFavoriteMovies),
    RenderPosition.BEFOREEND);
  // renderElement(
  //   mainElement,
  //   new SortMenuView(),
  //   RenderPosition.BEFOREEND);

  // const renderFilmList = () => {
  //   // const filmList = new FilmContainerView(renderedCards,true);
  //   // renderElement(
  //   //   mainElement,
  //   //   filmList,
  //   //   renderPosition.BEFOREEND);
  //   // filmList.renderCards();
  //   // filmList.renderShowMoreButton();
  //   const films = mainElement.querySelector('.films');
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

  const filmListPresenter = new FilmList(mainElement,filmsModel);
  filmListPresenter.init();

//   if (renderedCards.length >= 1) {
//    renderFilmList();
//   } else {
//     renderElement(
//       mainElement,
//       new FilmEmptyContainerView(NO_FILMS_MESSAGES.noMovies),
//       renderPosition.BEFOREEND);
//   }
};
siteRender();
