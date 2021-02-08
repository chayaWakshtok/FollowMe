import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryDoughnutChartPage } from './history-doughnut-chart';

@NgModule({
  declarations: [
    HistoryDoughnutChartPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryDoughnutChartPage),
  ],
})
export class HistoryDoughnutChartPageModule {}
