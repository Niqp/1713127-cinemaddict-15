import FilmContainer from './card-container';
import { Cards } from '../const';

const getCardTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class TopRatedSection extends FilmContainer {
  constructor(cards,removeAvailable) {
    super(cards,removeAvailable);
    this._amount = Cards.EXTRA_CARDS_TO_RENDER;
  }

  getTemplate() {
    return getCardTopRatedTemplate();
  }
}
