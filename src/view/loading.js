import AbstractView from './abstract-view.js';

const createNoTaskTemplate = () => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>
</section>
`
);

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
