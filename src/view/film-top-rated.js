import AbstractView from './abstract-view';

const getCardTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class TopRatedSection extends AbstractView {

  getTemplate() {
    return getCardTopRatedTemplate();
  }
}
