const getTopRatedMovies = (movies) => movies.slice().sort((a,b) => b.rating-a.rating);
const getMostCommentedMovies = (movies) => movies.slice().sort((a,b) => b.comments.length-a.comments.length);
const getNewestMovies = (movies) => movies.slice().sort((a,b) => b.releaseDate-a.releaseDate);

const getWatchlistMovies = (movies) => movies.filter((movie) => movie.isInWatchlist);
const getHistoryListMovies = (movies) => movies.filter((movie) => movie.isWatched);
const getFavoriteMovies = (movies) => movies.filter((movie) => movie.isFavorite);

export {getTopRatedMovies, getMostCommentedMovies, getNewestMovies, getWatchlistMovies, getHistoryListMovies, getFavoriteMovies};
