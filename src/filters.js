import { FilterType } from './const';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export const getTopRatedMovies = (films) => films.slice().sort((a,b) => b.rating-a.rating);
export const getMostCommentedMovies = (films) => films.slice().sort((a,b) => b.comments.length-a.comments.length);
export const getNewestMovies = (films) => films.slice().sort((a,b) => b.releaseDate-a.releaseDate);

