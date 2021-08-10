import { createElement } from '../utils.js';

const getNoFilmContainerTemplate = (message) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${message}</h2>
      <div class="films-list__container">
      </div>
    </section>
  </section>`
);

export default class FilmEmptyContainer {
  constructor(message) {
    this._element = null;
    this._message = message;
  }

  getTemplate() {
    return getNoFilmContainerTemplate(this._message);
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
