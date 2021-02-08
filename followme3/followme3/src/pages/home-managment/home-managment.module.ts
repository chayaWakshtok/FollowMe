import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeManagmentPage } from './home-managment';

@NgModule({
  declarations: [
    HomeManagmentPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeManagmentPage),
  ],
})
export class HomeManagmentPageModule {}
