import { FilterType } from './const';

export const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isInWatchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.isFavorite),
};

export const getTopRatedMovies = (movies) => movies.slice().sort((a,b) => b.rating-a.rating);
export const getMostCommentedMovies = (movies) => movies.slice().sort((a,b) => b.comments.length-a.comments.length);
export const getNewestMovies = (movies) => movies.slice().sort((a,b) => b.releaseDate-a.releaseDate);

