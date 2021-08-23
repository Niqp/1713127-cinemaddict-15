import AbstractView from './abstract-view';

const getSortMenuTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort-type="DEFAULT" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="DATE" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="RATING" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class SortMenu extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
    this._buttons = this.getElement().querySelectorAll('.sort__button');
    this._currentActiveButton = this.getElement().querySelector('.sort__button--active');
  }

  getTemplate() {
    return getSortMenuTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._currentActiveButton.classList.remove('sort__button--active');
    this._currentActiveButton = evt.target;
    evt.target.classList.add('sort__button--active');
    this._callback.click(evt.target.dataset.sortType);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    for (const button of this._buttons) {
      button.addEventListener('click', this._clickHandler);
    }
  }

}
