import { getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArrayQuantity, getRandomArrayItems, createDateWithDayGap } from '../utils.js';
import { mockFilms, mockText, mockGenres, mockPeople, emotes } from '../const.js';
import { nanoid } from 'nanoid';

function Comment() {
  this.emote = getRandomArrayElement(emotes);
  this.date = createDateWithDayGap(getRandomInteger(0,9000));
  this.author = getRandomArrayElement(mockPeople);
  this.message = getRandomArrayElement(mockText);
}

export default class Film {
  constructor () {
    const filmIndex = getRandomArrayQuantity(mockFilms)-1;
    const descriptionLength = getRandomInteger(1,5);
    const genresLength = getRandomInteger(1,3);
    this.id = nanoid();
    this.poster = mockFilms[filmIndex].poster;
    this.title = mockFilms[filmIndex].title;
    this.originalTitle = mockFilms[filmIndex].title;
    this.rating = getRandomFloat(0,10,1);
    this.director = getRandomArrayElement(mockPeople);
    this.writers = getRandomArrayItems(mockPeople,3);
    this.actors = getRandomArrayItems(mockPeople,3);
    this.releaseDate = createDateWithDayGap(getRandomInteger(0,9000));
    this.country = 'USA';
    this.duration = getRandomInteger(0,260);
    this.genres = getRandomArrayItems(mockGenres, genresLength);
    this.ageRestriction = '18+';
    this.description = getRandomArrayItems(mockText, descriptionLength);
    this.comments = new Array(getRandomInteger(0,5)).fill().map((item) => new Comment(item));
    this.isInWatchlist = Boolean(getRandomInteger(0, 1));
    this.isWatched = Boolean(getRandomInteger(0, 1));
    this.isFavorite = Boolean(getRandomInteger(0, 1));
  }
}
