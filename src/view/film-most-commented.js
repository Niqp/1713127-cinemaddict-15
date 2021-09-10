import AbstractView from './abstract-view';

const getCardMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most Commented</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class MostCommentedSection extends AbstractView {

  getTemplate() {
    return getCardMostCommentedTemplate();
  }
}

