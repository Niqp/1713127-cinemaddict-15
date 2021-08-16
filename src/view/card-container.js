import AbstractView from './abstract-view';
import CardView from './card';
import { CARDS } from '../const';
import { renderPosition } from '../const';
import { renderElement, remove } from '../render';
import ButtonShowMore from './button-show-more';

const getFilmContainerTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>
  </section>`
);

export default class FilmContainer extends AbstractView {
  constructor(cards,removeAvailable) {
    super();
    this._showMoreButton = new ButtonShowMore();
    this._showMoreButtonElement = this._showMoreButton.getElement();
    this._container = this.getElement().querySelector('.films-list__container');
    this._cards = cards;
    this._amount = CARDS.cardsToRender;
    this._removeAvailable = removeAvailable;
    this._generatedCardsCount = 0;
  }

  renderCards() {
    const cardsToRender = this._removeAvailable ? Math.min((CARDS.cardsToGenerate-this._generatedCardsCount), this._amount) : Math.min(this._cards.length, this._amount);
    let cardCounter = this._removeAvailable ? this._generatedCardsCount : 0;
    for (let i = 0; i < cardsToRender; i++) {
      const currentCard = new CardView(this._cards[cardCounter]);
      renderElement(
        this._container,
        currentCard,
        renderPosition.BEFOREEND);
      currentCard.addClickHandler(renderPosition.BEFOREEND);
      cardCounter+=1;
    }
    if (this._removeAvailable) {
      this._generatedCardsCount+=cardsToRender;
      if (this._generatedCardsCount >= this._cards.length) {
        remove(this._showMoreButton);
      }
    }
  }

  renderShowMoreButton() {
    if (this._generatedCardsCount < this._cards.length) {
      renderElement(this,this._showMoreButton,renderPosition.BEFOREEND);
      this._showMoreButtonElement.addEventListener('click', () => {
        this.renderCards();
      });
    }
  }

  getTemplate() {
    return getFilmContainerTemplate();
  }
}
