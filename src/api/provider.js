import FilmsModel from '../model/film-model.js';
import { isOnline } from '../utils/utils.js';

const getSyncedFilms = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.task);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(storeTasks.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));
          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  syncFilms() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.syncFilms(storeTasks)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}