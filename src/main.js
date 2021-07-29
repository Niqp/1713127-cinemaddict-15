import { createMenuTemplate } from './view/menu';
import { createSortMenuTemplate } from './view/menuSort';
import { createProfileTemplate } from './view/profile';
import { createCardContainerTemplate } from './view/cardContainer';
import { createCardExtraTemplate } from './view/cardExtra';
import { createCardTemplate } from './view/card';
import { createButtonShowMoreTemplate } from './view/buttonShowMore';
import { createCardPopupTemplate } from './view/cardPopup';
import { createFooterStatsTemplate } from './view/footerStats';

const CARDS_TO_RENDER = 5;
const EXTRA_CONTAINERS_TO_RENDER = 2;
const EXTRA_CARDS_TO_RENDER = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

const siteRender = () => {
  render(headerElement, createProfileTemplate(), 'beforeend');
  render(footerElement, createFooterStatsTemplate(), 'beforeend');
  render(mainElement, createMenuTemplate(), 'beforeend');
  render(mainElement, createSortMenuTemplate(), 'beforeend');
  render(mainElement, createCardContainerTemplate(), 'beforeend');

  const films = mainElement.querySelector('.films');
  const filmsList = films.querySelector('.films-list');
  const cardContainer = films.querySelector('.films-list__container');

  for (let i=0; i<CARDS_TO_RENDER; i++) {
    render(cardContainer, createCardTemplate(), 'beforeend');
  }

  render(filmsList, createButtonShowMoreTemplate(), 'beforeend');

  for (let i=0; i<EXTRA_CONTAINERS_TO_RENDER; i++) {
    render(films, createCardExtraTemplate(), 'beforeend');
    const currentExtraContainer = films.querySelector(`.films-list--extra:nth-of-type(${i+2})`);
    const currentCardContainer = currentExtraContainer.querySelector('.films-list__container');
    for (let j=0; j<EXTRA_CARDS_TO_RENDER; j++) {
      render(currentCardContainer, createCardTemplate(), 'beforeend');
    }
  }

  render(mainElement, createCardPopupTemplate(), 'beforeend');
};

siteRender();
