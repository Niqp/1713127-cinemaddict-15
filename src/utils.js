import dayjs from 'dayjs';
import { renderPosition } from './const.js';
// const ALERT_SHOW_TIME = 5000;
// const ALERT_ANIMATION_DELAY = 500;
const DEBOUNCE_DELAY = 500;

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

export const createFetch = (link) => fetch(link)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  });

export const createSend = (link,body) => fetch(
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

// const showAlert = (message) => {
//   const alertContainer = document.createElement('div');
//   alertContainer.style.zIndex = 100;
//   alertContainer.style.position = 'absolute';
//   alertContainer.style.left = 0;
//   alertContainer.style.top = 0;
//   alertContainer.style.right = 0;
//   alertContainer.style.padding = '10px 3px';
//   alertContainer.style.fontSize = '30px';
//   alertContainer.style.textAlign = 'center';
//   alertContainer.style.backgroundColor = 'red';
//   alertContainer.style.transition = 'all 0.5s';
//   alertContainer.style.transform = 'translateY(-100%)';
//   alertContainer.textContent = message;
//   document.body.append(alertContainer);

//   setTimeout(() => {alertContainer.style.transform = 'translateY(0)';},ALERT_ANIMATION_DELAY);
//   setTimeout(() => {
//     alertContainer.style.transform = 'translateY(-100%)';
//     setTimeout(() => {alertContainer.remove();},ALERT_ANIMATION_DELAY);
//   }, ALERT_SHOW_TIME);
// };

export function debounce (callback) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), DEBOUNCE_DELAY);
  };
}

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const createDateWithGap = (gap) => dayjs().add(gap, 'day').format('YYYY/MMMM/DD HH:MM');

export const generateElements = (elements,template) => {
  const generatedElements = new Array;
  elements.forEach((element) => {
    generatedElements.push(template(element));
  });
  return generatedElements;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const makePopupToggle = (clickArea,popup,renderContainer,position,button) => {
  let isToggled = false;
  let togglePopup = null;

  const closeCurrentPopup = () => {
    let onKeyPress = null;
    let onClick = null;
    const closeMessage = () => {
      popup.remove();
      document.removeEventListener('keydown',onKeyPress);
      if (button) {
        button.removeEventListener('click', onClick);
      }
      renderContainer.classList.remove('hide-overflow');
      togglePopup();
    };
    onKeyPress = (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    };
    onClick = () => {
      closeMessage();
    };
    document.addEventListener('keydown',onKeyPress);
    if (button) {
      button.addEventListener('click', onClick);
    }
  };

  const openPopup = () => {
    const onPopupClick = () => {
      renderElement(renderContainer,popup,position);
      clickArea.removeEventListener('click',onPopupClick);
      renderContainer.classList.add('hide-overflow');
      togglePopup();
    };
    clickArea.addEventListener('click',onPopupClick);
  };

  togglePopup = () => {
    if (!isToggled) {
      openPopup(clickArea,popup,renderContainer,position);
      isToggled = true;
    } else {
      closeCurrentPopup(popup,button);
      isToggled = false;
    }
  };

  togglePopup();
};
