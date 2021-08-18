import AbstractView from './abstract-view';

const getButtonShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMore extends AbstractView {
  getTemplate() {
    return getButtonShowMoreTemplate();
  }
}
