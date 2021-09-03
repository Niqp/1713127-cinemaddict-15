import { FilterType, RenderPosition, UpdateType } from '../const';
import { filter } from '../filters';
import { remove, replace, renderElement } from '../render';
import FilterMenu from '../view/menu-filter';

export default class FilterMenuPresenter {
  constructor(filterContainer,filterModel,filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._filterMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

  }

  init() {
    const filters = this._getFilters();
    const oldFilterMenuComponent = this._filterMenuComponent;
    this._filterMenuComponent = new FilterMenu(filters,this._filterModel.getFilter());
    this._filterMenuComponent.setFilterClickHandler(this._handleFilterTypeChange);
    if (oldFilterMenuComponent === null) {
      renderElement(this._filterContainer,this._filterMenuComponent,RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filterMenuComponent, oldFilterMenuComponent);
    remove(oldFilterMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR,filterType);
  }

  _getFilters() {
    const tasks = this._filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](tasks).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](tasks).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](tasks).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](tasks).length,
      },
    ];
  }
}
