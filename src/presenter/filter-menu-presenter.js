import { FilterType, RenderPosition, StateType, UpdateType } from '../const';
import { filter } from '../filters';
import { remove, replace, renderElement } from '../render';
import FilterMenu from '../view/menu-filter';

export default class FilterMenuPresenter {
  constructor(filterContainer,filterModel,filmsModel,siteStateModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._siteStateModel = siteStateModel;
    this._filterMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatMenuClick = this._handleStatMenuClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

  }

  init(currentFilter = this._filterModel.getFilter()) {
    const filters = this._getFilters();
    const oldFilterMenuComponent = this._filterMenuComponent;
    this._filterMenuComponent = new FilterMenu(filters,currentFilter);
    this._filterMenuComponent.setFilterClickHandler(this._handleFilterTypeChange);
    this._filterMenuComponent.setStatsClickHandler(this._handleStatMenuClick);
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
    if (this._siteStateModel.getState() === StateType.STATS) {
      this._siteStateModel.setState(UpdateType.MAJOR,StateType.FILMS);
    }
  }

  _handleStatMenuClick() {
    if (this._siteStateModel.getState() !== StateType.STATS) {
      this._siteStateModel.setState(UpdateType.MAJOR,StateType.STATS);
      this._filterModel.setFilter(UpdateType.MAJOR,FilterType.NONE);
    }
  }

  _getFilters() {
    const films = this._filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
