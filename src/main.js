import MainMenuView from './view/menu';
import SortMenuView from './view/menu-sort';
import ProfileView from './view/profile';
import FilmContainerView from './view/card-container';
import FilmEmptyContainerView from './view/empty-list';
import TopRatedSectionView from './view/card-top-rated';
import MostCommentedSectionView from './view/card-most-commented';
import FooterStatsView from './view/footer-stats';
import Film from './mock/generate-film';
import { calculateRank } from './profile-rank';
import { ranks, NO_FILMS_MESSAGES, renderPosition, CARDS } from './const';
import { getTopRatedMovies,getMostCommentedMovies,getWatchlistMovies,getHistoryListMovies,getFavoriteMovies} from './filters';
import { renderElement } from './render';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

const siteRender = () => {
  const renderedCards = new Array(CARDS.cardsToGenerate)
    .fill()
    .map((item) => new Film(item));
  const currentTopRatedMovies = getTopRatedMovies(renderedCards);
  const currentMostCommentedMovies = getMostCommentedMovies(renderedCards);
  const currentWatchlistMovies = getWatchlistMovies(renderedCards);
  const currentHistoryListMovies = getHistoryListMovies(renderedCards);
  const currentFavoriteMovies = getFavoriteMovies(renderedCards);

  if (currentHistoryListMovies.length >= 1) {
    renderElement(
      headerElement,
      new ProfileView(calculateRank(ranks, currentHistoryListMovies)),renderPosition.BEFOREEND);
  }
  renderElement(
    footerElement,
    new FooterStatsView(renderedCards),
    renderPosition.BEFOREEND);
  renderElement(
    mainElement,
    new MainMenuView(
      currentWatchlistMovies,
      currentHistoryListMovies,
      currentFavoriteMovies),
    renderPosition.BEFOREEND);
  renderElement(
    mainElement,
    new SortMenuView(),
    renderPosition.BEFOREEND);

  const renderFilmList = () => {
    const filmList = new FilmContainerView(renderedCards,true);
    renderElement(
      mainElement,
      filmList,
      renderPosition.BEFOREEND);
    const films = mainElement.querySelector('.films');
    filmList.renderCards();
    filmList.renderShowMoreButton();
    const renderExtraSection = (template, cards) => {
      const currentSection = new template(cards,false);
      renderElement(
        films,
        currentSection,
        renderPosition.BEFOREEND);
      currentSection.renderCards();
    };

    renderExtraSection(MostCommentedSectionView, currentTopRatedMovies);
    renderExtraSection(TopRatedSectionView, currentMostCommentedMovies);
  };

  if (renderedCards.length >= 1) {
    renderFilmList();
  } else {
    renderElement(
      mainElement,
      new FilmEmptyContainerView(NO_FILMS_MESSAGES.noMovies),
      renderPosition.BEFOREEND);
  }
};
siteRender();
