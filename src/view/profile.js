import AbstractView from './abstract-view';

const getProfileTemplate = (currentRank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${currentRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Profile extends AbstractView {
  constructor(currentRank) {
    super();
    this._currentRank = currentRank;
  }

  getTemplate() {
    return getProfileTemplate(this._currentRank);
  }
}
