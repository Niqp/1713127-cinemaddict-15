import AbstractObserver from '../utils/abstract-observer';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  set comments(comments) {
    this._comments = comments.slice();
  }

  get comments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  removeComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
    this._notify(updateType);
  }
}
