import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryBarChartsPage } from './history-bar-charts';

@NgModule({
  declarations: [
    HistoryBarChartsPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryBarChartsPage),
  ],
})
export class HistoryBarChartsPageModule {}
