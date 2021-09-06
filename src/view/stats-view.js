import { Ranks, StatFilterType } from '../const';
import { createDurationMinutes } from '../utils/utils';
import AbstractView from './abstract-view';

const getStatsTemplate = (stats,rank,activeButton) => {
  const {watched,duration,topGenre} = stats;
  return `<section class="statistic">
  ${rank !== Ranks.NONE.name ?
    `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
    </p>
    `
    :''}

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${activeButton === StatFilterType.ALL_TIME ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${activeButton === StatFilterType.TODAY ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${activeButton === StatFilterType.WEEK ? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${activeButton === StatFilterType.MONTH ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${activeButton === StatFilterType.YEAR ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watched} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${createDurationMinutes(duration).hours()} <span class="statistic__item-description">h</span> ${createDurationMinutes(duration).minutes()} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>
`;
};

export default class StatsView extends AbstractView {
  constructor(mainContainer,films,rank,activeButton) {
    super();
    this._films = films;
    this._rank = rank;
    this._activeButton = activeButton;
    this._mainContainer = mainContainer;
    this._statFilterClickHandler = this._statFilterClickHandler.bind(this);
    this._statButtons = this.getElement().querySelectorAll('.statistic__filters-input');
    this._currentActiveButton = this.getElement().querySelector('.statistic__filters-input:checked');
  }

  getTemplate() {
    return getStatsTemplate(this._films,this._rank,this._activeButton);
  }

  _statFilterClickHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.value);
  }

  setFilterClickHandler(callback) {
    this._callback.filterClick = callback;
    for (const button of this._statButtons) {
      button.addEventListener('click', this._statFilterClickHandler);
    }
  }
}
