import { createElement } from '../utils.js';

const getFooterStatsTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class FooterStats {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  getTemplate() {
    return getFooterStatsTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
