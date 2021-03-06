import AbstractView from './abstract-view';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  updateState(update,justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      update,
    );

    if (justStateUpdating) {
      return;
    }
    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }

}
