import AbstractView from './abstract-view';

const getNoFilmContainerTemplate = (message) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${message}</h2>
      <div class="films-list__container">
      </div>
    </section>
  </section>`
);

export default class FilmEmptyContainer extends AbstractView {
  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return getNoFilmContainerTemplate(this._message);
  }
}
