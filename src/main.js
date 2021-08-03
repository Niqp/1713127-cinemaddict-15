import { createMenuTemplate } from './view/menu';
import { createSortMenuTemplate } from './view/menu-sort';
import { createProfileTemplate } from './view/profile';
import { createCardContainerTemplate } from './view/card-container';
import { createCardTopRatedTemplate } from './view/card-top-rated';
import { createCardMostCommentedTemplate } from './view/card-most-commented';
import { createCardTemplate } from './view/card';
import { createButtonShowMoreTemplate } from './view/button-show-more';
import { createCardPopupTemplate } from './view/card-popup';
import { createFooterStatsTemplate } from './view/footer-stats';

import { Film } from './mock/generate-film.js';
import { ranks, NO_FILMS_MESSAGE } from './const.js';

const CARDS_TO_GENERATE = 15;
const CARDS_TO_RENDER = 5;
const EXTRA_CARDS_TO_RENDER = 2;
const DEFAULT_APPEND = 'beforeend';

let availableCards = CARDS_TO_GENERATE;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector('body');
const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

const renderedCards = new Array(CARDS_TO_GENERATE).fill().map((item) => new Film(item));
const topRatedCards = renderedCards.slice().sort((a,b) => b.rating-a.rating);
const mostCommentedCards = renderedCards.slice().sort((a,b) => b.comments.length-a.comments.length);
// const newestCards = renderedCards.slice().sort((a,b) => b.releaseDate-a.releaseDate);

const watchlistMovies = renderedCards.filter((card) => card.isInWatchlist);
const historyListMovies = renderedCards.filter((card) => card.isWatched);
const favoriteMovies = renderedCards.filter((card) => card.isFavorite);

const calculateRank = (currentRanks) => {
  for (const rank of currentRanks) {
    if (historyListMovies.length>=rank.low && historyListMovies.length<=rank.high) {
      return rank.name;
    }
  }};

const siteRender = () => {
  if (historyListMovies.length>=1) {
    render(headerElement, createProfileTemplate(calculateRank(ranks)), DEFAULT_APPEND);
  }
  render(footerElement, createFooterStatsTemplate(renderedCards), DEFAULT_APPEND);
  render(mainElement, createMenuTemplate(watchlistMovies,historyListMovies,favoriteMovies), DEFAULT_APPEND);
  render(mainElement, createSortMenuTemplate(), DEFAULT_APPEND);
  render(mainElement, createCardContainerTemplate(), DEFAULT_APPEND);

  const films = mainElement.querySelector('.films');
  const filmsList = films.querySelector('.films-list');
  const cardContainer = films.querySelector('.films-list__container');

  const renderFilmList = () => {
    render(filmsList, createButtonShowMoreTemplate(), DEFAULT_APPEND);

    const showMoreButton = filmsList.querySelector('.films-list__show-more');

    const renderCards = (container,cards,cardsAvailable,amount,removeAvailable) => {
      const cardsToRender = cardsAvailable>=amount ? amount : cardsAvailable;
      for (let i=0; i<cardsToRender; i++) {
        render(container, createCardTemplate(cards[i]), DEFAULT_APPEND);
      }
      if (removeAvailable) {
        availableCards-=cardsToRender;
        if (availableCards <=0) {
          showMoreButton.remove();
        }
      }
    };
    const onShowMoreClick = () => {
      renderCards(cardContainer, renderedCards, availableCards, CARDS_TO_RENDER, true);
      if (availableCards <=0) {
        showMoreButton.removeEventListener('click', onShowMoreClick);
      }
    };

    renderCards(cardContainer, renderedCards, availableCards, CARDS_TO_RENDER, true);

    if (showMoreButton) {
      showMoreButton.addEventListener('click',onShowMoreClick);
    }

    const renderExtraSection = (template,number,cards) => {
      render(films, template(), DEFAULT_APPEND);
      const sectionContainer = films.querySelector(`.films-list--extra:nth-of-type(${number})`);
      const sectionCardContainer = sectionContainer.querySelector('.films-list__container');
      renderCards(sectionCardContainer,cards,renderedCards.length,EXTRA_CARDS_TO_RENDER);
    };

    renderExtraSection(createCardTopRatedTemplate,2,topRatedCards);
    renderExtraSection(createCardMostCommentedTemplate,3,mostCommentedCards);
  };

  if (renderedCards.length>=1) {
    renderFilmList();
  } else {
    const noFilmsError = document.createElement('p');
    noFilmsError.textContent = NO_FILMS_MESSAGE;
    cardContainer.append(noFilmsError);
  }

  render(bodyElement, createCardPopupTemplate(renderedCards[0]), DEFAULT_APPEND);
};

siteRender();
