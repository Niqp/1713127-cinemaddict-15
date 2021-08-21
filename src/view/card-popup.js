import { generateElements } from '../utils.js';
import { emotes } from '../const.js';
import AbstractView from './abstract-view';

const getCardPopupTemplate = (film) => {
  const {poster,title,originalTitle,rating,director,writers,actors,releaseDate,country,duration,genres,ageRestriction,description,comments,isInWatchlist,isWatched,isFavorite} = film;

  const genreTemplate = (element) => (
    `<span class="film-details__genre">${element}</span>`
  );

  const commentTemplate = (element) => (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${element.emote}.png" width="55" height="55" alt="emoji-${element.emote}">
    </span>
    <div>
      <p class="film-details__comment-text">${element.message}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${element.author}</span>
        <span class="film-details__comment-day">${element.date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );

  const availableEmotesTemplate = (element) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${element}" value="${element}">
    <label class="film-details__emoji-label" for="emoji-${element}">
      <img src="./images/emoji/${element}.png" width="30" height="30" alt="emoji-${element}">
    </label>`
  );

  const generatedGenres = generateElements(genres,genreTemplate);
  const generatedComments = generateElements(comments,commentTemplate);
  const generatedEmotes = generateElements(emotes,availableEmotesTemplate);


  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${ageRestriction}</p>
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
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${generatedGenres}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description.join('')}
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
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
           ${generatedComments.join('')}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
              ${generatedEmotes.join('')}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>
`;
};

export default class CardPopup extends AbstractView {
  constructor(film,updateFilm) {
    super();
    this.film = film;
    this._updateFilm = updateFilm;
    this._closeButton = this.getElement().querySelector('.film-details__close-btn');
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistHandler = this._watchlistHandler.bind(this);
    this._watchedHandler = this._watchedHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._buttons = {
      watchlist: this.getElement().querySelector('.film-details__control-button--watchlist'),
      watched: this.getElement().querySelector('.film-details__control-button--watched'),
      favorite: this.getElement().querySelector('.film-details__control-button--favorite'),
    };

  }

  getTemplate() {
    return getCardPopupTemplate(this.film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistChange(this.film);
  }

  _watchedHandler(evt) {
    evt.preventDefault();
    this._callback.watchedChange(this.film);
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteChange(this.film);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this._closeButton.addEventListener('click', this._clickHandler);
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


}
