import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoriesPage } from './histories';

@NgModule({
  declarations: [
    HistoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoriesPage),
  ],
})
export class HistoriesPageModule {}
