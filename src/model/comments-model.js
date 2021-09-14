import { UpdateType } from '../const';
import AbstractObserver from '../utils/abstract-observer';
import { createDateFromString } from '../utils/utils';
import Films from './film-model';

export default class Comments extends AbstractObserver {
  constructor(api,filmsModel) {
    super();
    this._comments = [];
    this._api = api;
    this._filmsModel = filmsModel;
  }

  set comments(comments) {
    this._comments = comments.slice();
  }

  get comments() {
    return this._comments;
  }

  fetchComments(film) {
    return this._api.getComments(film)
      .then((comments) => {
        this.comments = comments;
        this._notify(UpdateType.PATCH, this._comments);
      });
  }

  addComment(updateType, film, comment) {
    return this._api.addComment(film,comment).then((update) => {
      this.comments = update.comments.map((currentComment) => Comments.adaptToClient(currentComment));
      this._filmsModel.updateFilm(updateType,Films.adaptToClient(update.movie),true);
    });
  }

  removeComment(updateType, update) {
    return this._api.removeComment(update).then(() => {
      const index = this._comments.findIndex((comment) => comment.id === update);

      if (index === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      this._comments = [
        ...this._comments.slice(0, index),
        ...this._comments.slice(index + 1),
      ];
    });
  }

  static adaptToClient(comment) {
    const adaptedComment = {
      id: comment.id,
      author: comment.author,
      emote: comment.emotion,
      date: createDateFromString(comment.date),
      message: comment.comment,
    };
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = {
      comment: comment.message,
      emotion: comment.emote,
    };
    return adaptedComment;
  }
}
