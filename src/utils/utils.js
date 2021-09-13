import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { SHAKE_ANIMATION_TIMEOUT } from '../const';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
const ALERT_SHOW_TIME = 3000;
const ALERT_ANIMATION_DELAY = 500;

export const getRandomInteger = (min, max) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export const getRandomFloat = (min, max, precision) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  return parseFloat((Math.random() * (upper - lower) + lower).toFixed(precision));
};

export const getRandomArrayElement = (elements) => elements[getRandomInteger(0,elements.length - 1)];
export const getRandomArrayQuantity = (elements) => getRandomInteger(1,elements.length);

export const getRandomArrayItems = (items,itemQuantity,deleteFromOriginalArray) => {
  if (items.length === 0) {
    throw new Error('Массив пустой!');
  }
  itemQuantity=Math.abs(itemQuantity);
  const itemsRemaining = items.slice();
  const deleteFromArray = () => {
    const arrayToDeleteFrom =  deleteFromOriginalArray?items:itemsRemaining;
    const itemSeed = getRandomInteger(0,arrayToDeleteFrom.length-1);
    const currentItem = arrayToDeleteFrom[itemSeed];
    arrayToDeleteFrom.splice(itemSeed,1);
    return currentItem;
  };
  if (itemQuantity === 1) {
    return [deleteFromArray()];
  }
  const data = new Array(itemQuantity).fill(null).map(deleteFromArray);
  return data;
};

export const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 100;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.style.transition = 'all 0.5s';
  alertContainer.style.transform = 'translateY(-100%)';
  alertContainer.textContent = message;
  document.body.append(alertContainer);

  setTimeout(() => {alertContainer.style.transform = 'translateY(0)';},0);
  setTimeout(() => {
    alertContainer.style.transform = 'translateY(-100%)';
    setTimeout(() => {alertContainer.remove();},ALERT_ANIMATION_DELAY);
  }, ALERT_SHOW_TIME);
};

export const isOnline = () => window.navigator.onLine;

export const createDateWithDayGap = (gap) => dayjs().subtract(gap, 'day');

export const createDateFromString = (date) => dayjs(date);

export const createCurrentDate = () => dayjs();

export const formatDate = (date,format = '') => date.format(format);

export const createDurationMinutes = (time) => dayjs.duration(time,'minutes');

export const getTimeFromNow = (date) => date.fromNow();

export const isTimeAfterDate = (date,afterType) => {
  if (!date) {
    return false;
  }
  const subtracted = createCurrentDate().subtract(1,afterType);
  return date.isSameOrAfter(subtracted);
};

export const generateElements = (elements,template) => {
  const generatedElements = new Array;
  elements.forEach((element) => {
    generatedElements.push(template(element));
  });
  return generatedElements;
};

export const shake = (item,callback) => {
  item.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  setTimeout(() => {
    item.style.animation = '';
    if (callback) {
      callback();
    }
  }, SHAKE_ANIMATION_TIMEOUT);
};

