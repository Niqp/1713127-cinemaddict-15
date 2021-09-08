export const Server = {
  AUTHORIZATION: 'Basic nikitayupatov021',
  END_POINT: 'https://15.ecmascript.pages.academy/cinemaddict',
};

export const DELETE_COMMENT_MESSAGE = 'Deleting...';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  NONE: 'none',
  DISABLED: 'disabled',
};

export const StateType = {
  FILMS: 'films',
  STATS: 'stats',
};

export const StatFilterType = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const NoFilmsMessages = {
  [FilterType.ALL]: 'There are no movies in our database.',
  [FilterType.WATCHLIST]: 'There are no movies to watch now.',
  [FilterType.HISTORY]: 'There are no watched movies now.',
  [FilterType.FAVORITES]: 'There are no favorite movies now.',
};


export const DateFormats = {
  DEFAULT: 'YYYY/MMMM/DD HH:MM',
  TO_YEAR: 'YYYY',
  TO_DAY: 'D MMMM YYYY',
  HOURS_AND_MINUTES: 'H[h] mm[m]',
};

export const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  REMOVE_COMMENT: 'REMOVE_COMMENT',
  TOGGLE_PARAMETERS: 'TOGGLE_PARAMETERS',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const ViewState = {
  SAVING: 'saving',
  DELETING: 'deleting',
  DEFAULT: 'default',
};

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const emotes = [
  {
    name: 'angry',
    isDisabled: false,
  },
  {
    name: 'puke',
    isDisabled: false,
  },

  {
    name: 'sleeping',
    isDisabled: false,
  },

  {
    name: 'smile',
    isDisabled: false,
  },
];

export const Ranks = {
  NONE: {
    name:'None',
    low:-Infinity,
    high:0,
  },
  NOVICE: {
    name:'Novice',
    low:1,
    high:10,
  },
  FAN: {
    name:'Fan',
    low:11,
    high:20,
  },
  MOVIEBUFF: {
    name:'Movie Buff',
    low:21,
    high:Infinity,
  },
};

export const CardNumber = {
  CARDS_TO_RENDER: 5,
  EXTRA_CARDS_TO_RENDER: 2,
};

export const SortType = {
  DEFAULT: 'DEFAULT',
  DATE: 'DATE',
  RATING: 'RATING',
};

