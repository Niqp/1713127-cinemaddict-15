import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractView from './abstract-view';

export default class StatsChartView extends AbstractView {
  constructor(container,sortedGenres) {
    super();
    this._container= container;
    this._sortedGenres = sortedGenres;
  }

  getStatChart () {
    if (!this._sortedGenres || this._sortedGenres.length<1) {
      return;
    }
    const BAR_HEIGHT = 50;
    const statisticCtx = this._container;
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
