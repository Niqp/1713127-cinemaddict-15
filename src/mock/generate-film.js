import { getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArrayQuantity, getRandomArrayItems, createDateWithGap } from '../utils.js';
import { mockFilms, mockText, mockGenres, mockPeople, emotes } from '../const.js';


const DAYS_GAP = 7;

function Comment() {
  this.emote = getRandomArrayElement(emotes);
  this.date = createDateWithGap(DAYS_GAP);
  this.author = getRandomArrayElement(mockPeople);
  this.message = getRandomArrayElement(mockText);
}

export default class Film {
  constructor () {
    const filmIndex = getRandomArrayQuantity(mockFilms)-1;
    const descriptionLength = getRandomInteger(1,5);
    const genresLength = getRandomInteger(1,3);
    const releaseYear = getRandomInteger(1895,2021);
    this.poster = mockFilms[filmIndex].poster;
    this.title = mockFilms[filmIndex].title;
    this.originalTitle = mockFilms[filmIndex].title;
    this.rating = getRandomFloat(0,10,1);
    this.director = getRandomArrayElement(mockPeople);
    this.writers = getRandomArrayItems(mockPeople,3);
    this.actors = getRandomArrayItems(mockPeople,3);
    this.releaseDate = releaseYear;
    this.country = 'USA';
    this.year = releaseYear;
    this.duration = `${getRandomInteger(0,3)}h ${getRandomInteger(0,59)}m`;
    this.genres = getRandomArrayItems(mockGenres, genresLength);
    this.ageRestriction = '18+';
    this.description = getRandomArrayItems(mockText, descriptionLength);
    this.comments = new Array(getRandomInteger(0,5)).fill().map((item) => new Comment(item));
    this.isInWatchlist = Boolean(getRandomInteger(0, 1));
    this.isWatched = Boolean(getRandomInteger(0, 1));
    this.isFavorite = Boolean(getRandomInteger(0, 1));
  }
}
