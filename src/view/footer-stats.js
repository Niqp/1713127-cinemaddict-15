import AbstractView from './abstract-view';

const getFooterStatsTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return getFooterStatsTemplate(this._films);
  }
}
