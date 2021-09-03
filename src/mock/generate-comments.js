import { getRandomArrayElement, getRandomInteger, createDateWithDayGap } from '../utils/utils';
import { emotes, mockPeople, mockText } from '../const';

export default class Comment {
  constructor(id) {
    this.id = id;
    this.emote = getRandomArrayElement(emotes);
    this.date = createDateWithDayGap(getRandomInteger(0,9000));
    this.author = getRandomArrayElement(mockPeople);
    this.message = getRandomArrayElement(mockText);
  }
}
