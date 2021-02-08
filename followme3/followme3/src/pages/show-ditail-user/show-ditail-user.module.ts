import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowDitailUserPage } from './show-ditail-user';

@NgModule({
  declarations: [
    ShowDitailUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowDitailUserPage),
  ],
})
export class ShowDitailUserPageModule {}
