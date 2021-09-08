import AbstractView from './abstract-view';

const getFooterStatsTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films ? `${films.length} movies inside` : 'Loading films...' }</p>
  </section>`
);

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  updateElement(films) {
    this._films = films;
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
  }

  getTemplate() {
    return getFooterStatsTemplate(this._films);
  }
}
