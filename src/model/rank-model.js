import AbstractObserver from '../utils/abstract-observer.js';
import { Ranks } from '../const.js';

export default class RankModel extends AbstractObserver {
  constructor() {
    super();
    this._activeRank = Ranks.NOVICE;
  }

  setRank(updateType, rank) {
    this._activeRank = rank;
    this._notify(updateType, rank);
  }

  getRank() {
    return this._activeRank;
  }
}
