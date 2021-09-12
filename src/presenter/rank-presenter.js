import { FilterType, Ranks, RenderPosition, UpdateType } from '../const';
import { filter } from '../filters';
import { remove, renderElement, replace } from '../render';
import Profile from '../view/profile';

export default class RankPresenter {
  constructor(rankContainer,rankModel,filmsModel) {
    this._rankContainer = rankContainer;
    this._rankModel = rankModel;
    this._filmsModel = filmsModel;
    this._rankComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._getRank = this._getRank.bind(this);
    this._filmsModel.addObserver(this._getRank);
    this._getRank();
  }

  init() {
    this._rankModel.addObserver(this._handleModelEvent);
    if (this._rankModel.getRank() !== Ranks.NONE) {
      const oldRankComponent = this._rankComponent;
      this._rankComponent = new Profile(this._rankModel.getRank().name);
      if (oldRankComponent === null) {
        renderElement(this._rankContainer,this._rankComponent,RenderPosition.BEFOREEND);
        return;
      }
      replace(this._rankComponent, oldRankComponent);
      remove(oldRankComponent);
    }
  }

  destroy() {
    remove(this._rankComponent);
    this._rankComponent = null;
    this._rankModel.removeObserver(this._handleModelEvent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getRank() {
    const currentFilms = this._filmsModel.films;
    if (currentFilms === null) {
      return;
    }
    const currentHistoryLength = filter[FilterType.HISTORY](this._filmsModel.films).length;
    for (const rank of Object.values(Ranks)) {
      if (currentHistoryLength >= rank.low && currentHistoryLength <= rank.high) {
        this._rankModel.setRank(UpdateType.PATCH,rank);
      }
    }
    if (this._rankModel.getRank() === Ranks.NONE && this._rankComponent !== null) {
      this.destroy();
    }
    if (this._rankModel.getRank() !== Ranks.NONE && this._rankComponent === null) {
      this.init();
    }
  }
}
