const ALERT_SHOW_TIME = 5000;
const ALERT_ANIMATION_DELAY = 500;
const DEBOUNCE_DELAY = 500;
import dayjs from 'dayjs';

const getRandomInteger = (min, max) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const getRandomFloat = (min, max, precision) => {
  const lower = Math.min(Math.abs(min), Math.abs(max));
  const upper = Math.max(Math.abs(min), Math.abs(max));
  return parseFloat((Math.random() * (upper - lower) + lower).toFixed(precision));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0,elements.length - 1)];
const getRandomArrayQuantity = (elements) => getRandomInteger(1,elements.length);

const getRandomArrayItems = (items,itemQuantity,deleteFromOriginalArray) => {
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

const createFetch = (link) => fetch(link)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  });

const createSend = (link,body) => fetch(
  link,
  {
    method: 'POST',
    body,
  },
)
  .then((response) => {
    if (response.ok) {
      return response;
    }
    throw new Error(`${response.status} ${response.statusText}`);
  });

const showAlert = (message) => {
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

  setTimeout(() => {alertContainer.style.transform = 'translateY(0)';},ALERT_ANIMATION_DELAY);
  setTimeout(() => {
    alertContainer.style.transform = 'translateY(-100%)';
    setTimeout(() => {alertContainer.remove();},ALERT_ANIMATION_DELAY);
  }, ALERT_SHOW_TIME);
};

const closeCurrentMessage = (messageToClose,form,button) => {
  let onKeyPress = null;
  let onClick = null;
  const closeMessage = () => {
    messageToClose.remove();
    document.removeEventListener('keydown',onKeyPress);
    document.body.removeEventListener('click',onClick);
    if (button) {
      button.removeEventListener('click', onClick);
    }
  };
  onKeyPress = (evt) => {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  };
  onClick = () => {
    closeMessage();
  };
  if (form) {
    form.reset();
  }
  document.addEventListener('keydown',onKeyPress);
  document.body.addEventListener('click',onClick);
  if (button) {
    button.addEventListener('click', onClick);
    button.focus();
  }
};

function debounce (callback) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), DEBOUNCE_DELAY);
  };
}

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const createDateWithGap = (gap) => dayjs().add(gap, 'day').format('YYYY/MMMM/DD HH:MM');


export { getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArrayQuantity, getRandomArrayItems,  createFetch, createSend, showAlert, closeCurrentMessage, debounce, shuffle, createDateWithGap };
