import AbstractObserver from '../utils/abstract-observer';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  set films(films) {
    this._films = films.slice();
  }

  get films() {
    return this._films;
  }

  updateItem (updateType, update) {
    const index = this._films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
