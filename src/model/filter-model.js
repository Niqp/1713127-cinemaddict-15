import AbstractObserver from '../utils/abstract-observer.js';
import { FilterType, UpdateType } from '../const.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  set filter(filter) {
    this._activeFilter = filter;
    this._notify(UpdateType.MAJOR, filter);
  }

  get filter() {
    return this._activeFilter;
  }
}
