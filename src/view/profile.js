import { createElement } from '../utils.js';

const getProfileTemplate = (currentRank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${currentRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Profile {
  constructor(currentRank) {
    this._element = null;
    this._currentRank = currentRank;
  }

  getTemplate() {
    return getProfileTemplate(this._currentRank);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
