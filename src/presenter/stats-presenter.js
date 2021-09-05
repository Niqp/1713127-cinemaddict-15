import { FilterType, RenderPosition, StatFilterType } from '../const';
import { filter } from '../filters';
import { remove, renderElement, replace } from '../render';
import StatsView from '../view/stats-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IsTimeAfterDate } from '../utils/utils';

export default class StatsPresenter {
  constructor(statsContainer,filmsModel,rankModel) {
    this._statsContainer = statsContainer;
    this._rankModel = rankModel;
    this._filmsModel = filmsModel;
    this._statsComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._getFilmStats = this._getFilmStats.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._currentActiveButton = StatFilterType.ALL_TIME;
  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._rankModel.addObserver(this._handleModelEvent);
    this._historyList = filter[FilterType.HISTORY](this._filmsModel.films);
    const oldStatsComponent = this._statsComponent;
    if (oldStatsComponent === null) {
      this._filmStats = this._getFilmStats(this._historyList);
      this._currentActiveButton = StatFilterType.ALL_TIME;
    }
    this._statsComponent = new StatsView(this._statsContainer,this._filmStats,this._rankModel.getRank().name,this._currentActiveButton);
    this._statsComponent.setFilterClickHandler(this._handleFilterChange);
    if (oldStatsComponent === null) {
      renderElement(this._statsContainer,this._statsComponent,RenderPosition.BEFOREEND);
      this._getStatChart();
      return;
    }
    replace(this._statsComponent, oldStatsComponent);
    this._getStatChart();
    remove(oldStatsComponent);
  }

  destroy() {
    remove(this._statsComponent);
    this._statsComponent = null;
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._rankModel.removeObserver(this._handleModelEvent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(statFilter) {
    switch (statFilter) {
      case StatFilterType.ALL_TIME:
        this._filmStats = this._getFilmStats(this._historyList);
        this._currentActiveButton = StatFilterType.ALL_TIME;
        this.init();
        break;
      case StatFilterType.TODAY:
        this._filmStats = this._getFilmStats(this._filterFilmsByWatchedDate(this._historyList,'days'));
        this._currentActiveButton = StatFilterType.TODAY;
        this.init();
        break;
      case StatFilterType.WEEK:
        this._filmStats = this._getFilmStats(this._filterFilmsByWatchedDate(this._historyList,'week'));
        this._currentActiveButton = StatFilterType.WEEK;
        this.init();
        break;
      case StatFilterType.MONTH:
        this._filmStats = this._getFilmStats(this._filterFilmsByWatchedDate(this._historyList,'month'));
        this._currentActiveButton = StatFilterType.MONTH;
        this.init();
        break;
      case StatFilterType.YEAR:
        this._filmStats = this._getFilmStats(this._filterFilmsByWatchedDate(this._historyList,'year'));
        this._currentActiveButton = StatFilterType.YEAR;
        this.init();
        break;
    }

  }

  _filterFilmsByWatchedDate(films,dateCount,dateType) {
    return films.slice().filter((film) => IsTimeAfterDate(film.watchedDate,dateCount,dateType));
  }

  _getFilmStats(films) {
    if (films.length<1) {
      this._sortedGenres = null;
      return {
        watched: 0,
        duration: 0,
        topGenre: 'None',
      };
    }
    const duration = films.reduce((sum,film) => sum + film.duration,0);

    const genres = films.reduce((sum,film)  => {
      film.genres.forEach((genre) => {
        sum[genre] = ( sum[genre] || 0 ) + 1;
      });
      return sum;
    },{});

    this._sortedGenres = Object.entries(genres)
      .map(([name,value]) => ({name,value}))
      .sort((a,b) => b.value - a.value);
    const topGenre = this._sortedGenres[0].name;
    return {
      watched: films.length,
      duration: duration,
      topGenre: topGenre,
    };
  }

  _getStatChart () {
    if (!this._sortedGenres || this._sortedGenres.length<1) {
      return;
    }
    const BAR_HEIGHT = 50;
    const statisticCtx = document.querySelector('.statistic__chart');
    const labels = this._sortedGenres.map((genre) => genre.name);
    const data = this._sortedGenres.map((genre) => genre.value);

    statisticCtx.height = BAR_HEIGHT * labels.length;

    this._chart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: [...labels],
        datasets: [{
          data: [...data],
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }


}
