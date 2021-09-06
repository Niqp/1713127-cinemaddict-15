import { FilterType } from '../const';
import AbstractView from './abstract-view';

const getFilterMenuItem = (filter,currentFilter) => {
  const {type,name,count} = filter;
  return `<a href="#${type}" class="main-navigation__item ${type === currentFilter ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">${name} ${name === 'All movies' ? '' : `<span class="main-navigation__item-count" data-filter-type="${type}">${count}</span>`}</a>`;
};

const getMenuTemplate = (filterItems, currentFilter) =>{
  const filterItemsTemplate = filterItems.map((filter) => getFilterMenuItem(filter,currentFilter)).join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentFilter === FilterType.NONE ? 'main-navigation__item--active' : ''}" data-filter-type="stats">Stats</a>
  </nav>`;
};

export default class FilterMenu extends AbstractView {
  constructor(filters,currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
    this._buttons = this.getElement().querySelectorAll('.main-navigation__item');
    this._statMenuButtom = this.getElement().querySelector('.main-navigation__additional');
  }

  getTemplate() {
    return getMenuTemplate(this._filters,this._currentFilter);
  }

  _filterClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.filterType);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;
    for (const button of this._buttons) {
      button.addEventListener('click', this._filterClickHandler);
    }
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this._statMenuButtom.addEventListener('click',this._statsClickHandler);
  }

}
