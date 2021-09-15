import FilmsModel from '../model/film-model.js';
import { isOnline } from '../utils/utils.js';

const createStoreStructure = (items) => items
  .reduce((acc, current) => Object.assign({}, acc, {
    [current.id]: current,
  }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  get offlineUpdated() {
    return Object.values(this._store.getItems())
      .filter((item) => item.isOfflineUpdated === true)
      .map((item) => {
        delete item.isOfflineUpdated;
        return item;
      });
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

    this._store.setItem(film.id, Object.assign({}, FilmsModel.adaptToServer(film), {isOfflineUpdated: true}));

    return Promise.resolve(film);
  }

  syncFilms() {
    if (isOnline()) {
      const storeTasks = this.offlineUpdated;
      if (storeTasks.length < 1) {
        return;
      }
      return this._api.syncFilms(storeTasks)
        .then((response) => {
          const updatedFilms = response.updated;
          updatedFilms.forEach((film) => {
            const item = createStoreStructure([film]);
            this._store.setItem(item);
          });
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
