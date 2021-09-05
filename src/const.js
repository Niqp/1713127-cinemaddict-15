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
};

export const mockFilms = [
  {
    title: 'Made for Each Other',
    poster: 'made-for-each-other.png',
  },
  {
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    poster: 'popeye-meets-sinbad.png',
  },
  {
    title: 'Sagebrush Trail',
    poster: 'sagebrush-trail.jpg',
  },
  {
    title: 'Santa Claus Conquers the Martians',
    poster: 'santa-claus-conquers-the-martians.jpg',
  },
  {
    title: 'The Dance of Life',
    poster: 'the-dance-of-life.jpg',
  },
  {
    title: 'The Great Flamarion',
    poster: 'the-great-flamarion.jpg',
  },
  {
    title: 'The Man with the Golden Arm',
    poster: 'the-man-with-the-golden-arm.jpg',
  },
];

export const mockText = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus. ',
];

export const mockGenres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
];

export const mockPeople = [
  'Anthony Mann',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
];

export const emotes = [
  'angry',
  'puke',
  'sleeping',
  'smile',
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
  CARDS_TO_GENERATE: 14,
  CARDS_TO_RENDER: 5,
  EXTRA_CARDS_TO_RENDER: 2,
};

export const SortType = {
  DEFAULT: 'DEFAULT',
  DATE: 'DATE',
  RATING: 'RATING',
};

