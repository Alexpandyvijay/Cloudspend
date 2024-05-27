import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'cs-barchart',
  template: `
  <div class="chart-container">
    <canvas baseChart
            [datasets]="chartData"
            [labels]="chartLabels"
            [options]="chartOptions"
            [legend]="chartLegend"
            [type]="chartType">
    </canvas>
  </div>`
})
export class BarchartComponent {

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  chartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  chartType: ChartType = 'bar';
  chartLegend = true;
  chartData: ChartDataset[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor() {}
}
