import { generateElements, createDurationMinutes, formatDate, getTimeFromNow } from '../utils/utils.js';
import { DateFormats, DELETE_COMMENT_MESSAGE, emotes } from '../const.js';
import SmartView from './smart-view.js';
import he from 'he';

const genreTemplate = (element) => (
  `<span class="film-details__genre">${element}</span>`
);

const commentTemplate = (element) => (
  `<li class="film-details__comment" data-comment-id="${element.id}">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${element.emote}.png" width="55" height="55" alt="emoji-${element.emote}">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(element.message)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${element.author}</span>
      <span class="film-details__comment-day">${getTimeFromNow(element.date)}</span>
      <button type="button" class="film-details__comment-delete" data-comment-id="${element.id}" ${element.isDeleting ? 'disabled' : ''}>${element.isDeleting ? 'Deleting...' : 'Delete'}</button>
    </p>
  </div>
</li>`
);

const availableEmotesTemplate = (element) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${element.name}" value="${element.name}" ${element.isDisabled ? 'disabled' : ''} ${element.isSelected ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${element.name}">
    <img src="./images/emoji/${element.name}.png" width="30" height="30" alt="emoji-${element.name}">
  </label>`
);

const getFilmPopupTemplate = (state,comments) => {
  const {poster,title,originalTitle,rating,director,writers,actors,releaseDate,country,duration,genres,ageRestriction,description,isInWatchlist,isWatched,isFavorite,newCommentEmote,newCommentMessage, isSaving, isDeleting, deletedComment} = state;
  const generatedGenres = generateElements(genres,genreTemplate);
  const currentComments = isDeleting ? comments.map((comment) => {
    if (comment.id === deletedComment) {
      return {...comment, isDeleting: true};
    }
    return comment;
  }) : comments;
  const generatedComments = currentComments === null ? null : generateElements(currentComments,commentTemplate);
  const currentEmotes = isSaving ? emotes.map((emote) =>  ({...emote, isDisabled: false})) : emotes.map((emote) => {
    if (emote.name === newCommentEmote) {
      return {...emote, isSelected: true};
    }
    return emote;
  });
  const generatedEmotes = generateElements(currentEmotes,availableEmotesTemplate);


  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRestriction}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formatDate(releaseDate,DateFormats.TO_DAY)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatDate(createDurationMinutes(duration),DateFormats.HOURS_AND_MINUTES)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${generatedGenres.length>1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">${generatedGenres.join('')}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isInWatchlist?'film-details__control-button--active':''}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${isWatched?'film-details__control-button--active':''}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavorite?'film-details__control-button--active':''}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments === null ? '' : comments.length}</span></h3>

          <ul class="film-details__comments-list">
           ${generatedComments === null ? 'Loading...' : generatedComments.join('')}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${newCommentEmote ? `<img src="images/emoji/${newCommentEmote}.png" width="55" height="55" alt="emoji-smile">` : ''}</div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="${isSaving ? 'Saving...' : 'Select reaction below and write comment here'}" name="comment" ${isSaving ? 'disabled' : ''}>${newCommentMessage ? he.encode(newCommentMessage) : ''}</textarea>
              </label>
              <div class="film-details__emoji-list">
              ${generatedComments === null ? '' : generatedEmotes.join('')}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>
`;
};

export default class FilmPopup extends SmartView {
  constructor(film,comments) {
    super();
    this._currentId = film.id;
    this._state = FilmPopup.parseFilmToState(film);
    this._checkedEmote = this._state.newCommentEmote;
    this._comments = comments;
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchlistHandler = this._watchlistHandler.bind(this);
    this._watchedHandler = this._watchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._newCommentEmoteChangeHandler = this._newCommentEmoteChangeHandler.bind(this);
    this._newCommentTextAreaHandler = this._newCommentTextAreaHandler.bind(this);
    this._newCommentSendHandler = this._newCommentSendHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._getHandledElements();
    this._setInnerHandlers();

  }

  get comments() {
    return this._comments;
  }

  set comments(comments) {
    this._comments = comments;
  }

  getTemplate() {
    return getFilmPopupTemplate(this._state,this._comments);
  }

  restoreHandlers() {
    this._getHandledElements();
    this._setInnerHandlers();
    this._restoreOuterHandlers();

  }

  get currentId () {
    return this._currentId;
  }

  _getHandledElements() {
    this._buttons = {
      closePopup: this.getElement().querySelector('.film-details__close-btn'),
      watchlist: this.getElement().querySelector('.film-details__control-button--watchlist'),
      watched: this.getElement().querySelector('.film-details__control-button--watched'),
      favorite: this.getElement().querySelector('.film-details__control-button--favorite'),
      deleteComment: this.getElement().querySelectorAll('.film-details__comment-delete'),
    };
    this._emotes = this.getElement().querySelectorAll('.film-details__emoji-item');
    this._textArea = this.getElement().querySelector('.film-details__comment-input');

  }

  _setInnerHandlers() {
    for (const emote of this._emotes) {
      emote.addEventListener('click', this._newCommentEmoteChangeHandler);
    }
    this._textArea.addEventListener('input',this._newCommentTextAreaHandler);
  }

  _restoreOuterHandlers() {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchlistHandler(this._callback.watchlistChange);
    this.setWatchedHandler(this._callback.watchedChange);
    this.setFavoriteHandler(this._callback.favoriteChange);
    this.setCommentSendHandler(this._callback.newCommentSend);
    this.setCommentDeleteHandler(this._callback.deleteComment);
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    evt.target.innerHTML = DELETE_COMMENT_MESSAGE;
    this._callback.deleteComment(FilmPopup.parseStateToFilm(this._state),evt.target.dataset.commentId);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _watchlistHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistChange(FilmPopup.parseStateToFilm(this._state));
  }

  _watchedHandler(evt) {
    evt.preventDefault();
    this._callback.watchedChange(FilmPopup.parseStateToFilm(this._state));
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange(FilmPopup.parseStateToFilm(this._state));
  }

  _newCommentEmoteChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.value !== this._state.newCommentEmote) {
      this._checkedEmote = evt.target.value;
      const currentY = this.getElement().scrollTop;
      this.updateState(
        {
          isNewCommentEmote: true,
          newCommentEmote: this._checkedEmote,
        },
      );
      this.getElement().scrollTo(0,currentY);
    }
  }

  _newCommentTextAreaHandler(evt) {
    evt.preventDefault();
    this.updateState(
      {
        newCommentMessage: evt.target.value,
      }, true,
    );
  }

  _newCommentSendHandler(evt) {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();
      if (this._state.newCommentEmote && this._state.newCommentMessage) {
        this._newComment = {
          emote: this._state.newCommentEmote,
          message: this._state.newCommentMessage,
        };
        this._state.comments.push(this._newComment.id);
        this._state.newCommentMessage = null;
        this._state.newCommentEmote = null;
        this._checkedEmote = null;
        this._callback.newCommentSend(FilmPopup.parseStateToFilm(this._state),this._newComment);
      }
    }
  }

  setCommentDeleteHandler(callback) {
    this._callback.deleteComment = callback;
    for (const button of this._buttons.deleteComment) {
      button.addEventListener('click',this._deleteCommentHandler);
    }
  }

  setCommentSendHandler(callback) {
    this._callback.newCommentSend = callback;
    this._textArea.addEventListener('keydown',this._newCommentSendHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this._buttons.closePopup.addEventListener('click', this._closeButtonClickHandler);
  }

  setWatchlistHandler(callback) {
    this._callback.watchlistChange = callback;
    this._buttons.watchlist.style.cursor = 'pointer';
    this._buttons.watchlist.addEventListener('click',this._watchlistHandler);
  }

  setWatchedHandler(callback) {
    this._callback.watchedChange = callback;
    this._buttons.watched.style.cursor = 'pointer';
    this._buttons.watched.addEventListener('click',this._watchedHandler);
  }

  setFavoriteHandler(callback) {
    this._callback.favoriteChange = callback;
    this._buttons.favorite.style.cursor = 'pointer';
    this._buttons.favorite.addEventListener('click',this._favoriteHandler);
  }

  static parseFilmToState(film) {
    return Object.assign(
      {},
      film,
      {
        isNewComment: false,
        newCommentEmote: null,
        newCommentMessage: null,
        isSaving: false,
        isDeleting: false,
        deletedComment: null,
      },
    );
  }

  static parseStateToFilm(state) {
    state = Object.assign({}, state);

    delete state.newCommentEmote;
    delete state.newCommentMessage;
    delete state.isNewComment;
    delete state.isSaving;
    delete state.isDeleting;
    delete state.deletedComment;
    return state;
  }
}
