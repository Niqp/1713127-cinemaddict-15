import { UpdateType } from '../const';
import AbstractObserver from '../utils/abstract-observer';
import { createDateFromString, formatDate } from '../utils/utils';

export default class Films extends AbstractObserver {
  constructor(api) {
    super();
    this._films = [];
    this._api = api;
  }

  set films(films) {
    this._films = films.slice();
    this._notify(UpdateType.INIT);
  }

  get films() {
    return this._films;
  }

  fetchFilms() {
    return this._api.getFilms().then((films) => {
      this.films = films;
    });
  }

  updateFilm (updateType, film, fromComment) {
    return this._api.updateFilm(film,fromComment).then((update) => {
      const index = this._films.findIndex((item) => item.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting film');
      }

      this._films = [
        ...this._films.slice(0, index),
        update,
        ...this._films.slice(index + 1),
      ];

      this._notify(updateType, update);
    });
  }

  static adaptToClient(film) {
    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'poster': film.film_info.poster,
      'title': film.film_info.title,
      'originalTitle': film.film_info.alternative_title,
      'rating': film.film_info.total_rating,
      'director': film.film_info.director,
      'writers': film.film_info.writers,
      'actors': film.film_info.actors,
      'releaseDate': createDateFromString(film.film_info.release.date),
      'country': film.film_info.release.release_country,
      'duration': film.film_info.runtime,
      'genres': film.film_info.genre,
      'ageRestriction': film.film_info.age_rating,
      'description': film.film_info.description,
      'isInWatchlist': film.user_details.watchlist,
      'isWatched': film.user_details.already_watched,
      'watchedDate': createDateFromString(film.user_details.watching_date),
      'isFavorite': film.user_details.favorite,
    };

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'film_info': {
        'title': film.title,
        'alternative_title': film.originalTitle,
        'total_rating': film.rating,
        'poster': film.poster,
        'age_rating': film.ageRestriction,
        'director': film.director,
        'writers': film.writers,
        'actors': film.actors,
        'release': {
          'date': formatDate(film.releaseDate),
          'release_country': film.country,
        },
        'runtime': film.duration,
        'genre': film.genres,
        'description': film.description,
      },
      'user_details': {
        'watchlist': film.isInWatchlist,
        'already_watched': film.isWatched,
        'watching_date': formatDate(film.watchedDate),
        'favorite': film.isFavorite,
      },
    };

    return adaptedFilm;
  }
}
