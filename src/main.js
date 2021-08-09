import MainMenuView from './view/menu';
import SortMenuView from './view/menu-sort';
import ProfileView from './view/profile';
import FilmContainerView from './view/card-container';
import TopRatedSectionView from './view/card-top-rated';
import MostCommentedSectionView from './view/card-most-commented';
import CardView from './view/card';
import ButtonShowMoreView from './view/button-show-more';
import CardPopupView from './view/card-popup';
import FooterStatsView from './view/footer-stats';
import Film from './mock/generate-film';
import { calculateRank } from './profile-rank';
import { ranks, NO_FILMS_MESSAGE, renderPosition } from './const';
import { getTopRatedMovies,getMostCommentedMovies,getWatchlistMovies,getHistoryListMovies,getFavoriteMovies} from './filters.js';
import { renderElement, makePopupToggle } from './utils';

const CARDS_TO_GENERATE = 15;
const CARDS_TO_RENDER = 5;
const EXTRA_CARDS_TO_RENDER = 2;

const bodyElement = document.querySelector('body');
const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

let generatedCardsCount = 0;

const siteRender = () => {
  const renderedCards = new Array(CARDS_TO_GENERATE)
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
      new ProfileView(calculateRank(ranks, currentHistoryListMovies)).getElement(),renderPosition.BEFOREEND);
  }
  renderElement(
    footerElement,
    new FooterStatsView(renderedCards).getElement(),
    renderPosition.BEFOREEND);
  renderElement(
    mainElement,
    new MainMenuView(
      currentWatchlistMovies,
      currentHistoryListMovies,
      currentFavoriteMovies).getElement(),
    renderPosition.BEFOREEND);
  renderElement(
    mainElement,
    new SortMenuView().getElement(),
    renderPosition.BEFOREEND);
  renderElement(
    mainElement,
    new FilmContainerView().getElement(),
    renderPosition.BEFOREEND);

  const films = mainElement.querySelector('.films');
  const filmsList = films.querySelector('.films-list');
  const cardContainer = films.querySelector('.films-list__container');

  const renderFilmList = () => {
    const showMoreButton = new ButtonShowMoreView();
    renderElement(
      filmsList,
      showMoreButton.getElement(),
      renderPosition.BEFOREEND);
    const showMoreButtonClass = filmsList.querySelector('.films-list__show-more');

    const renderCards = (container,cards,amount,removeAvailable) => {
      const cardsToRender = (CARDS_TO_GENERATE-generatedCardsCount) >= amount ? amount : (CARDS_TO_GENERATE-generatedCardsCount);
      let cardCounter = removeAvailable ? generatedCardsCount : 0;
      for (let i = 0; i < cardsToRender; i++) {
        const currentCard = new CardView(cards[cardCounter]);
        renderElement(
          container,
          currentCard.getElement(),
          renderPosition.BEFOREEND);
        const currentCardLinks = {
          poster: currentCard.getElement().querySelector('.film-card__poster'),
          title: currentCard.getElement().querySelector('.film-card__title'),
          comments: currentCard.getElement().querySelector('.film-card__comments'),
        };
        Object.keys(currentCardLinks).forEach((key) => {
          const popup = new CardPopupView(cards[cardCounter]);
          const popupCloseButton = popup.getElement().querySelector('.film-details__close-btn');
          makePopupToggle(currentCardLinks[key],popup.getElement(),bodyElement,renderPosition.BEFOREEND,popupCloseButton);
        });
        cardCounter+=1;
      }
      if (removeAvailable) {
        generatedCardsCount+=cardsToRender;
        if (generatedCardsCount >= renderedCards.length) {
          showMoreButtonClass.remove();
        }
      }
    };
    const onShowMoreClick = () => {
      renderCards(cardContainer,renderedCards,CARDS_TO_RENDER,true);
    };
    renderCards(cardContainer,renderedCards,CARDS_TO_RENDER,true);

    if (showMoreButtonClass) {
      showMoreButtonClass.addEventListener('click', onShowMoreClick);
    }

    const renderExtraSection = (template, number, cards) => {
      renderElement(
        films,
        new template().getElement(),
        renderPosition.BEFOREEND);
      const sectionContainer = films.querySelector(
        `.films-list--extra:nth-of-type(${number})`);
      const sectionCardContainer = sectionContainer.querySelector(
        '.films-list__container');
      renderCards(
        sectionCardContainer,
        cards,
        EXTRA_CARDS_TO_RENDER);
    };

    renderExtraSection(MostCommentedSectionView, 2, currentTopRatedMovies);
    renderExtraSection(TopRatedSectionView, 3, currentMostCommentedMovies);
  };

  if (renderedCards.length >= 1) {
    renderFilmList();
  } else {
    const noFilmsError = document.createElement('p');
    noFilmsError.textContent = NO_FILMS_MESSAGE;
    cardContainer.append(noFilmsError);
  }

//   renderElement(
//     bodyElement,
//     new CardPopupView(renderedCards[0]).getElement(),
//     renderPosition.BEFOREEND);
// };
};
siteRender();

