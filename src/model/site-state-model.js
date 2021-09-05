import AbstractObserver from '../utils/abstract-observer.js';
import { StateType } from '../const.js';

export default class SiteState extends AbstractObserver {
  constructor() {
    super();
    this._activeState = StateType.FILMS;
  }

  setState(updateType, state) {
    this._activeState = state;
    this._notify(updateType, state);
  }

  getState() {
    return this._activeState;
  }
}
